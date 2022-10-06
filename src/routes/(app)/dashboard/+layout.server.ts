import { redirect } from '@sveltejs/kit';
import { withAuth } from '@supabase/auth-helpers-sveltekit';
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = withAuth(({ session }) => {
  if (!session.user) {
    throw redirect(303, '/');
  }
  return {
    session
  };
});