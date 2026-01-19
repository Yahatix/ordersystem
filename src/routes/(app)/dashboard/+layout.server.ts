import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const session = await locals.safeGetSession()
    
    if (!session.session) {
        redirect(303, '/');
    }
    return {
        session: session.session
    };
};
