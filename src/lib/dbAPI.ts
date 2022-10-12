import {
  PUBLIC_SUPABASE_ORDER_TABLE,
  PUBLIC_SUPABASE_PRODUCT_TABLE
} from "$env/static/public"
import { writable, derived } from 'svelte/store';
import { supabaseClient } from "./db";
import { currentOrder } from "./stores";
import { curr_formatter } from "./utils";

export interface OrderRequest {
  delivered: boolean
  done: boolean
}

export interface Order extends OrderRequest {
  id: number
  created_at: string
  orderItem: OrderItem[]
}

export interface CurrentOrderItem {
  extraWish: string
  product: Product
}

export interface OrderItemRequest {
  extraWish: string
  product: number
  orderId: number
}
export interface OrderItem {
  extraWish: string
  product: Product
}

export interface ProductRequest {
  name: string
  price: number
  active: boolean
  image_path: string
  public_image_path?: string
}
export interface Product extends ProductRequest {
  id: number
}

export const userStore = writable(supabaseClient.auth.user())

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event == 'SIGNED_IN' && session) {
    userStore.set(session.user)
  } else if (event == 'SIGNED_OUT') {
    userStore.set(null)
  }
})

const db = {
  products: {
    tableName: PUBLIC_SUPABASE_PRODUCT_TABLE,
    async new(product: ProductRequest) {
      return await supabaseClient
        .from<Product>(db.products.tableName)
        .insert(product)
    },
    async getAll() {
      const { body } = await supabaseClient
        .from(db.products.tableName)
        .select('*')
      return body || []
    },
    async uploadImage(file: File) {
      return await supabaseClient.storage.from("product-image").upload(file.name, file)
    },
    getImage(product: Product) {
      if (product.public_image_path) return product.public_image_path

      const { publicURL } = supabaseClient.storage.from("product-image").getPublicUrl(product.image_path)
      products.update(prs => prs.map(p => {
        if (p.id !== product.id) return p
        p.public_image_path = publicURL || undefined
        return p
      }))

      return publicURL
    },
    async update(product: Product) {
      delete product.public_image_path
      return await supabaseClient
        .from<Product>(db.products.tableName)
        .update(product)
        .match({ id: product.id })
    },
  },
  orders: {
    tableName: PUBLIC_SUPABASE_ORDER_TABLE,
    async get(id: number) {
      const { body } = await supabaseClient
        .from<Order>(db.orders.tableName)
        .select('*, orderItem(extraWish, product(*))')
        .eq('id', id)
        .single()
      return body
    },
    async getAll() {
      const { body } = await supabaseClient
        .from<Order>(db.orders.tableName)
        .select('*, orderItem(extraWish, product(*))')
      return body || []
    },
    async getByDate(day: Date) {
      const start = new Date(day)
      start.setHours(0, 0, 0, 0)
      const end = new Date(day)
      end.setHours(23, 59, 59, 999)

      const datestring = (d: Date) => d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

      const { body } = await supabaseClient
        .from<Order>(db.orders.tableName)
        .select('*, orderItem(product(*))')
        .gt('created_at', datestring(start))
        .lt('created_at', datestring(end))
      return body || []
    },
    async getOrderDays() {
      const { body } = await supabaseClient
        .from(db.orders.tableName)
        .select("created_at")
        .eq("delivered", true)
        .eq("done", true)
        .order('delivered')
      const daysWithStats = [...new Set(body?.map(d => {
        const date = new Date(d.created_at)
        date.setHours(0, 0, 0, 0)
        return date.toDateString()
      }))]
      return daysWithStats

    },
    async create(items: CurrentOrderItem[]) {
      const { body } = await supabaseClient
        .from<Order>(db.orders.tableName)
        .insert({})
        .single()
      if (!body) return
      await supabaseClient
        .from<OrderItemRequest>('orderItem')
        .insert(items.map(i => ({ ...i, orderId: body.id, product: i.product.id })))
      return body
    },
    async finishOrder(order: Order) {
      await supabaseClient
        .from<Order>(db.orders.tableName)
        .update({ done: true })
        .match({ id: order.id })
    },
    async deliverOrder(order: Order) {
      await supabaseClient
        .from<Order>(db.orders.tableName)
        .update({ delivered: true })
        .match({ id: order.id })
    }
  }
}

export const orders = writable<Order[]>([])
db.orders.getAll().then(res => orders.set(res))

supabaseClient.from<Order>(db.orders.tableName)
  .on("INSERT", (payload) => {
    db.orders.get(payload.new.id)
      .then(order => {
        orders.update(val => order ? [...val, order] : val)
      })
  }
  )
  .on("UPDATE", (payload) => orders.update(val => val = val.map(p => p.id !== payload.new.id ? p : payload.new)))
  .subscribe()

export const unfinishedOrders = derived(orders, $orders => $orders.filter(o => !o.done))
export const finishedOrders = derived(orders, $orders => $orders.filter(o => o.done && !o.delivered))
export const deliveredOrders = derived(orders, $orders => $orders.filter(o => o.done && o.delivered))

export const total = derived(currentOrder, $currentOrder => curr_formatter.format(
  $currentOrder.reduce((curr, val) => (curr += val.product.price), 0)
))

export const orderStats = derived(deliveredOrders, ($orders => {
  return [
    ...$orders.flatMap(a => a.orderItem).reduce<Map<number, [Product, number]>>((curr, val) => {
      const p = val.product
      const toppingStats = curr.get(p.id)?.[1] || 0;
      curr.set(p.id, [p, toppingStats + 1]);
      return curr;
    }, new Map())
  ].sort((a, b) => {
    if (a[1][0] > b[1][0]) return -1;
    if (a[1][0] < b[1][0]) return 1;
    return 0;
  })
}))

export const products = writable<Product[]>([])
export const activeProducts = derived(products, $products => $products.filter(p => p.active))
db.products.getAll().then(res => products.set(res))

supabaseClient.from<Product>(db.products.tableName).on("UPDATE", (payload) => {
  products.update(val => val = val.map(p => p.id !== payload.new.id ? p : payload.new))
}).subscribe()


export default db