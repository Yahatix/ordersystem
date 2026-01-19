import { supabase } from '$lib/db';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async default({ request, url }) {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email) {
			return fail(400, {
				error: 'Please enter your email'
			});
		}
		if (!password) {
			return fail(400, {
				error: 'Please enter a password'
			});
		}

		const { data, error } = await supabase.auth.signUp({email, password, options: {
			emailRedirectTo: url.origin,
		}});

		if (error || !data) {
			if (error?.status === 400) {
				return fail(400, {
					error: 'Invalid credentials'
				});
			}
			return fail(500, {
				error: 'Server error. Try again later.'
			});
		}

		return { success: true };
	}
};
