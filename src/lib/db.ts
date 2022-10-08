import {
  PUBLIC_SUPABASE_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public"
import { dev } from "$app/environment"

import { createClient } from '@supabase/supabase-js'
import { setupSupabaseHelpers } from "@supabase/auth-helpers-sveltekit"

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
