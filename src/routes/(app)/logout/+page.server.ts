import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async default({ locals }) {
		locals.supabase.auth.signOut();
		redirect(303, '/');
	}
};
