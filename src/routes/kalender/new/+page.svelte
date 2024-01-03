<script>
  import { extractTeaser, fetchJSON } from '$lib/util';
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';
  import Foreningen from '$lib/components/Foreningen.svelte';
  import Calevent from '$lib/components/Calevent.svelte';
  import NotEditable from '$lib/components/NotEditable.svelte';
  import { currentUser, isEditing } from '$lib/stores';
  import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';

  export let data;

  let showUserMenu = false,
    title = '202X-MM-DD Händelse',
    content = 'Skriv (eller kopiera och klistra in) din text här.';

  $: {
    $currentUser = data.currentUser;
    $isEditing = true;
  }

  async function createCalevent() {
    if (!$currentUser) {
      return alert('Sorry, you are not authorized to create new events.');
    }
    const teaser = extractTeaser(document.getElementById('calevent_content'));
    try {
      const { slug } = await fetchJSON('POST', '/api/create-calevent', {
        title,
        content,
        teaser,
      });
      goto(`/kalender/${slug}`);
    } catch (err) {
      console.error(err);
      alert('Det finns redan en händelse med samma titel. Välj en annan titel.');
    }
  }

  async function discardDraft() {
    goto('/kalender');
  }
</script>

<svelte:head>
  <title>Ny händelse | Turf Västerbotten</title>
</svelte:head>

<WebsiteHeader bind:showUserMenu on:cancel={discardDraft} on:save={createCalevent} />

<Calevent bind:title bind:content />

<NotEditable>
  <Foreningen />
</NotEditable>

<Footer counter="/kalender/new" />
