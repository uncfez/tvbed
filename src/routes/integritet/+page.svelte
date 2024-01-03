<script>
  import Footer from '$lib/components/Footer.svelte';
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import { fetchJSON } from '$lib/util';
  import { currentUser, isEditing } from '$lib/stores.js';
  import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';
  import Foreningen from '../../lib/components/Foreningen.svelte';

  export let data;

  let showUserMenu = false,
    title,
    integritet;

  // --------------------------------------------------------------------------
  // DEFAULT PAGE CONTENT - AJDUST TO YOUR NEEDS
  // --------------------------------------------------------------------------

  function initOrReset() {
    $currentUser = data.currentUser;
    title = data.page?.title || 'Personuppgifts- och datahanteringspolicy';
    integritet = data.page?.integritet ||

    

      [
        ['Ken Experiences GmbH', 'Mozartstraße 56', '4020 Linz, Austria'].join('<br/>'),
        [
          'Managing Director: DI Michael Aufreiter',
          'Register No: FN 408728x',
          'Court: Linz',
          'VAT ID: ATU68395257'
        ].join('<br/>')
      ]
        .map(text => `<p>${text}</p>`)
        .join('\n');
  }

  initOrReset();

  function toggleEdit() {
    $isEditing = true;
    showUserMenu = false;
  }

  async function savePage() {
    if (!$currentUser) return alert('Sorry, you are not authorized.');
    try {
      fetchJSON('POST', '/api/save-page', {
        pageId: 'integritet',
        page: {
          title,
          integritet
        }
      });
      $isEditing = false;
    } catch (err) {
      console.error(err);
      alert('Något gick fel. Försök igen.');
    }
  }
</script>

<svelte:head>
  <title>Integritet | Turf Västerbotten</title>
</svelte:head>

<WebsiteHeader bind:showUserMenu on:cancel={initOrReset} on:save={savePage}>
  <PrimaryButton on:click={toggleEdit}>Redigera sida</PrimaryButton>
  <LoginMenu />
</WebsiteHeader>

<div class="py-12 sm:py-24">
  <div class="max-w-screen-md mx-auto px-6 md:text-xl">
    <h1 class="text-4xl md:text-7xl font-bold pb-8">
      <PlainText bind:content={title} />
    </h1>
    <div class="prose md:prose-xl pb-12 sm:pb-0">
      <RichText multiLine bind:content={integritet} />
    </div>
  </div>
</div>



<Foreningen />

<Footer counter="/integritet" />
