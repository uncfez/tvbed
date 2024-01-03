import { getPage } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const page = await getPage('vandringspokalen');
  return {
    currentUser,
    page
  };
}
