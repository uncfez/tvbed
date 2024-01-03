import { getCaleventBySlug, getNextCalevent } from '$lib/api';

export async function load({ params, locals }) {
  const currentUser = locals.user;
  const data = await getCaleventBySlug(params.slug);
  const nextCalevent = await getNextCalevent(params.slug);
  const calevents = nextCalevent ? [nextCalevent] : [];
  return {
    ...data,
    currentUser,
    calevents
  };
}
