import { env } from "$env/dynamic/public"
import { dev } from "$app/environment"
import { writable } from 'svelte/store';

import { createClient } from '@supabase/supabase-js'
import { setupSupabaseHelpers } from "@supabase/auth-helpers-sveltekit"

type Topping = 'Schoko' | 'Schoko+Banane' | 'Zimt+Zucker' | 'Apfelmus';

export type TOrder = {
  nr: number;
  type: `Crepes`;
  done: boolean;
  topping: Topping;
  extraWish: string
};

export type TProduct = {
  id: number
  created_at: Date
  name: string
  price: number
  image_path: string
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

const orderTableName = `orders-${env.PUBLIC_SUPABASE_LOCATION}`

const db = {
  get user() {
    return userStore
  },
  products: {
    tableName: `products-${env.PUBLIC_SUPABASE_LOCATION}`,
    async getAll() {
      const { body } = await supabaseClient
        .from<TProduct>(db.products.tableName)
        .select('*')
      return body
    },
    async uploadImage(file: File) {
      return await supabaseClient.storage.from("product-image").upload(file.name, file)
    },
    getImage(path: string) {
      const { publicURL } = supabaseClient.storage.from("product-image").getPublicUrl(path)
      return publicURL
    }
  },
  orders: {
    async getAll() {
      const { body } = await supabaseClient
        .from<TOrder>(orderTableName)
        .select('*')
        .order('nr')
      return body
    },
    async get() {
      const { body } = await supabaseClient
        .from<TOrder>(orderTableName)
        .select('*')
        .order('nr')
        .eq('done', false)
      return body
    },
    async stats() {
      const { body } = await supabaseClient
        .from<TOrder>(orderTableName)
        .select('*')
        .order('nr')
      return body
    },
    async create(order: TOrder) {
      const { body } = await supabaseClient
        .from<TOrder>(orderTableName)
        .insert(order)

      return body?.[0]
    },

    async finishOrder(order: TOrder) {
      const { body } = await supabaseClient
        .from<TOrder>(orderTableName)
        .update({ done: true })
        .match({ nr: order.nr })

      return body?.[0]
    }
  }
}

export const orders = writable<TOrder[]>([])

supabaseClient.from(orderTableName).on("INSERT", (payload) => {
  orders.update(val => {
    return [...val, payload.new]
  })
}).subscribe()


export default db