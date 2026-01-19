import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession()
	// if the user is already logged in return them to the account page
	if (session) {
		redirect(303, '/dashboard')
	}
	return { url: url.origin }
}

export const actions: Actions = {
	async default({ request, cookies, url, locals }) {
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
				error: 'Please enter your password',
				values: {
					email
				}
			});
		}

		const { data, error } = await locals.supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error || !data) {
			if (error?.status === 400) {
				return fail(400, {
					error: 'Invalid credentials',
					values: {
						email
					}
				});
			}
			return fail(500, {
				error: 'Server error. Try again later.',
				values: {
					email
				}
			});
		}

		redirect(303, '/dashboard');
	}
};
