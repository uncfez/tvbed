import { json } from '@sveltejs/kit';
import { updateCalevent } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.user;
  const { slug, title, content, teaser } = await request.json();
  await updateCalevent(slug, title, content, teaser, currentUser);
  return json({ slug, status: 'ok' });
}
