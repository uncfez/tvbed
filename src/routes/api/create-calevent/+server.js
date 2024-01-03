import { json } from '@sveltejs/kit';
import { createCalevent } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.user;
  const { title, content, teaser} = await request.json();
  const { slug } = await createCalevent(title, content, teaser, currentUser);
  return json({ slug });
}
