import { getPage } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const page = await getPage('bli-medlem');
  return {
    currentUser,
    page
  };
}
