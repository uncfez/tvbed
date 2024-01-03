import { json } from '@sveltejs/kit';
import { deleteCalevent } from '$lib/api';

export async function POST({ request, locals }) {
  const user = locals.user;
  const { slug } = await request.json();
  const result = await deleteCalevent(slug, user);
  return json(result);
}
