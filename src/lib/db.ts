import { env } from "$env/dynamic/public"
import { dev } from "$app/environment"
import { writable, derived } from 'svelte/store';

import { createClient } from '@supabase/supabase-js'
import { setupSupabaseHelpers } from "@supabase/auth-helpers-sveltekit"

export type TOrder<T = TProduct> = {
  nr?: number;
  product: T,
  done: boolean;
  extraWish: string
};

export type TProduct = {
  id?: number
  created_at?: Date
  image_path: string
  name: string
  price: number
  active: boolean
}

export const supabaseClient = createClient(
  env.PUBLIC_SUPABASE_URL,
  env.PUBLIC_SUPABASE_KEY,
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
    tableName: `products-${env.PUBLIC_SUPABASE_LOCATION}`,
    async new(product: TProduct) {
      return await supabaseClient
        .from<TProduct>(db.products.tableName)
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
    getImage(path: string) {
      const { publicURL } = supabaseClient.storage.from("product-image").getPublicUrl(path)
      return publicURL
    },
    async toggleActive(product: TProduct) {
      console.log("toggleActive: ",product.active);
      
      return await supabaseClient
        .from<TProduct>(db.products.tableName)
        .update({ ...product, active: !product.active })
        .match({ id: product.id })
    }
  },
  orders: {
    tableName: `orders-${env.PUBLIC_SUPABASE_LOCATION}`,
    async getAll() {
      const { body } = await supabaseClient
        .from<TOrder>(db.orders.tableName)
        .select('*, product (*)')
        .order('nr')
      return body || []
    },
    async get() {
      const { body } = await supabaseClient
        .from<TOrder>(db.orders.tableName)
        .select('*, product (*)')
        .order('nr')
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
        .match({ nr: order.nr })

      return body?.[0]
    }
  }
}

export const orders = writable<TOrder[]>([])
db.orders.getAll().then(res => orders.set(res))

supabaseClient.from<TOrder>(db.orders.tableName).on("INSERT", (payload) => {
  orders.update(val => {
    return [...val, payload.new]
  })
}).subscribe()

export const finishedOrders = derived(orders, $orders => $orders.filter(o => o.done))

export const orderStats = derived(finishedOrders, ($orders => {
  return [
    ...$orders.reduce<Map<string, number>>((curr, val) => {
      if (typeof val.product === 'number') return curr;

      const toppingStats = curr.get(val.product.name) || 0;
      curr.set(val.product.name, toppingStats + 1);
      return curr;
    }, new Map())
  ].sort((a, b) => {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
  })
}))

export const products = writable<TProduct[]>([])
db.products.getAll().then(res => products.set(res))

supabaseClient.from<TProduct>(db.products.tableName).on("UPDATE", (payload) => {
  console.log(payload.new.active);
  
  products.update(val => val = val.map(p => p.id !== payload.new.id ? p : payload.new))
}).subscribe()


export default db