import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_LOCATION, PUBLIC_SUPABASE_URL } from "$env/static/public"
import { dev } from "$app/environment"
import { writable, derived, get } from 'svelte/store';

import { createClient, type SupabaseRealtimePayload } from '@supabase/supabase-js'
import { setupSupabaseHelpers } from "@supabase/auth-helpers-sveltekit"

export type TOrder<T = TProduct> = {
  id?: number;
  product: T,
  done: boolean;
  extraWish: string
};

export type TProduct = {
  id?: number
  created_at?: Date
  public_image_path?: string
  image_path: string
  name: string
  price: number
  active: boolean
}

export const supabaseClient = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_KEY,
  {
    persistSession: false,
    autoRefreshToken: false,
  }
)

setupSupabaseHelpers({
  supabaseClient,
  cookieOptions: {
    secure: !dev
  }
})

const userStore = writable(supabaseClient.auth.user())

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event == 'SIGNED_IN' && session) {
    userStore.set(session.user)
  } else if (event == 'SIGNED_OUT') {
    userStore.set(null)
  }
})

const db = {
  get user() {
    return userStore
  },
  products: {
    tableName: `products-${PUBLIC_SUPABASE_LOCATION}`,
    async new(product: TProduct) {
      return await supabaseClient
        .from<TProduct>(db.products.tableName)
        .insert(product)
    },
    async get(id: number) {
      const { body } = await supabaseClient
        .from<TOrder<number>>(db.products.tableName)
        .select('*')
        .eq('id', id)
        .single()
      return body || []
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
    getImage(path: string) {
      const { publicURL } = supabaseClient.storage.from("product-image").getPublicUrl(path)
      return publicURL
    },
    async toggleActive(product: TProduct) {
      return await supabaseClient
        .from<TProduct>(db.products.tableName)
        .update({ ...product, active: !product.active })
        .match({ id: product.id })
    }
  },
  orders: {
    tableName: `orders-${PUBLIC_SUPABASE_LOCATION}`,
    async getAll() {
      const { body } = await supabaseClient
        .from<TOrder>(db.orders.tableName)
        .select('*, product (*)')
        .order('id')
      return body || []
    },
    async get() {
      const { body } = await supabaseClient
        .from<TOrder>(db.orders.tableName)
        .select('*, product (*)')
        .order('id')
        .eq('done', false)
      return body || []
    },
    async create(order: TOrder<number>) {
      const { body } = await supabaseClient
        .from<TOrder<number>>(db.orders.tableName)
        .insert(order)

      return body?.[0]
    },

    async finishOrder(order: TOrder) {
      const { body } = await supabaseClient
        .from<TOrder>(db.orders.tableName)
        .update({ done: true })
        .match({ id: order.id })

      return body?.[0]
    }
  }
}

export const orders = writable<TOrder<TProduct>[]>([])
db.orders.getAll().then(res => orders.set(res))

supabaseClient.from<TOrder>(db.orders.tableName)
  .on("INSERT", (payload) => orders.update(val => {
    const p = { ...payload.new, product: get(products).find(p => p.id === payload.new.product as unknown as number) } as unknown as TOrder
    return [...val, p]
  }))
  .on("UPDATE", (payload) => orders.update(val => val = val.map(p => p.id !== payload.new.id ? p : payload.new)))
  .subscribe()

export const unfinishedOrders = derived(orders, $orders => $orders.filter(o => !o.done))
export const finishedOrders = derived(orders, $orders => $orders.filter(o => o.done))

export const orderStats = derived(finishedOrders, ($orders => {
  return [
    ...$orders.reduce<Map<number, [Required<TProduct>, number]>>((curr, val) => {
      const p = val.product as Required<TProduct>
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

export const products = writable<TProduct[]>([])
db.products.getAll().then(res => products.set(res))

supabaseClient.from<TProduct>(db.products.tableName).on("UPDATE", (payload) => {
  products.update(val => val = val.map(p => p.id !== payload.new.id ? p : payload.new))
}).subscribe()


export default db