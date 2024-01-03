import { getCalevents } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const calevents = await getCalevents(currentUser);

  return {
    currentUser,
    calevents
  };
}
