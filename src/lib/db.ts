import { createClient } from '@supabase/supabase-js'
import { setupSupabaseHelpers } from "@supabase/auth-helpers-sveltekit"
import { env } from "$env/dynamic/public"
import { dev } from "$app/environment"
import { writable } from 'svelte/store';

type Topping = 'Schoko' | 'Schoko+Banane' | 'Zimt+Zucker' | 'Apfelmus';

export type TOrder = {
  nr: number;
  type: `Crepes`;
  done: boolean;
  topping: Topping;
  extraWish: string
};

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
        .from(db.products.tableName)
        .select('*')
        return body
    },
    async uploadImage(file: File) {
      console.log(file.name);
      
      const {data, error} = await supabaseClient.storage.from("product-image").upload(file.name, file)
      console.log({data,error});
      
    },
    getImage(path: string) {
      return supabaseClient.storage.from("product-image").getPublicUrl(path)
    }
  },
  orders: {
    async getAll() {
      const { body } = await supabaseClient
        .from(orderTableName)
        .select('*')
        .order('nr')
      return body as TOrder[]
    },
    async get() {
      const { body } = await supabaseClient
        .from(orderTableName)
        .select('*')
        .order('nr')
        .eq('done', false)
      return body as TOrder[]
    },
    async stats() {
      const { body } = await supabaseClient
        .from(orderTableName)
        .select('*')
        .order('nr')
      return body as TOrder[]
    },
    async create(order: TOrder) {
      const { body } = await supabaseClient
        .from(orderTableName)
        .insert(order)

      return body?.[0]
    },

    async finishOrder(order: TOrder) {
      const { body } = await supabaseClient
        .from(orderTableName)
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