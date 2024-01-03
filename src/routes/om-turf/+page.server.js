import { getPage } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const page = await getPage('om-turf');
  return {
    currentUser,
    page
  };
}
