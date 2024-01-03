import { getArticles, getCalevents, getPage } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const articles = await getArticles();
  const calevents = await getCalevents();
  const page = await getPage('home');

  return {
    currentUser,
    articles: articles.slice(0, 3),
    calevents: calevents.slice(0,2),
    page
  };
}
