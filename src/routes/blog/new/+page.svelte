<script>
  import { extractTeaser, extractTeaserImage, fetchJSON } from '$lib/util';
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';
  import Foreningen from '$lib/components/Foreningen.svelte';
  import Article from '$lib/components/Article.svelte';
  import NotEditable from '$lib/components/NotEditable.svelte';
  import { currentUser, isEditing } from '$lib/stores';
  import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';

  export let data;

  let showUserMenu = false,
    title = 'Namnlös',
    content = 'Skriv (eller kopiera och klistra in) din text här.';

  $: {
    $currentUser = data.currentUser;
    $isEditing = true;
  }

  async function createArticle() {
    if (!$currentUser) {
      return alert('Sorry, you are not authorized to create new articles.');
    }
    const teaser = extractTeaser(document.getElementById('article_content'));
    const teaser_image = extractTeaserImage(document.getElementById('article_content'));
    try {
      const { slug } = await fetchJSON('POST', '/api/create-article', {
        title,
        content,
        teaser,
        teaser_image
      });
      goto(`/blog/${slug}`);
    } catch (err) {
      console.error(err);
      alert('Det finns redan ett inlägg med samma titel. Välj en annan titel.');
    }
  }

  async function discardDraft() {
    goto('/blog');
  }
</script>

<svelte:head>
  <title>Nytt inlägg | Turf Västerbotten</title>
</svelte:head>

<WebsiteHeader bind:showUserMenu on:cancel={discardDraft} on:save={createArticle} />

<Article bind:title bind:content />

<NotEditable>
  <Foreningen />
</NotEditable>

<Footer counter="/blog/new" />
