/// <reference types="@sveltejs/kit" />

import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from './supabase.ts';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;

			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;

			session: Session | null;

			user: User | null;
		}

		interface PageData {
			session: Session | null;
		}
		// interface Platform {}
		// interface Session {}
		// interface Stuff {}
	}
}
