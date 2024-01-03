<script>
  import Footer from '$lib/components/Footer.svelte';
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import { fetchJSON } from '$lib/util';
  import { currentUser, isEditing } from '$lib/stores.js';
  import Testimonial from '$lib/components/Testimonial.svelte';
  import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';
  import Foreningen from '../../lib/components/Foreningen.svelte';

  export let data;

  const FAQS_PLACEHOLDER = `
		<h2>1. Endast för nya medlemmar</h2>
    <p>Fyll i detta formulär. I och med att du fyller i och skickar in formuläret godkänner du att Turf Västerbotten samlar in och hanterar dina personuppgifter. För mer information om hur vi hanterar dina personuppgifter se Turf Västerbottens personuppgifts- och datahanteringspolicy.</p>
    <h2>2. Nya OCH gamla medlemmar</h2>
    <p>Betala in medlemsavgiften (vuxen, junior eller familjemedlemskap) till Bankgiro 5353–0572 eller Swish 123 242 91 40. OBS! Ange som meddelande “Årsavgift + Turfnick på alla personer betalningen avser”. Ansökan är komplett först när betalning inkommit till föreningen. Betald medlemsavgift återbetalas ej vid eventuellt utträde ur föreningen.</p>
	`;

  const TESTIMONIALS_PLACEHOLDER = [
    {
      text: '“Bara en zon till...”',
      image: '/images/person-placeholder.png',
      name: 'Turf Turfare · turfgame.com'
    }
  ];

  let showUserMenu = false,
    title,
    medlem,
    testimonials,
    faqs;

  // --------------------------------------------------------------------------
  // DEFAULT PAGE CONTENT - AJDUST TO YOUR NEEDS
  // --------------------------------------------------------------------------

  function initOrReset() {
    $currentUser = data.currentUser;
    title = data.page?.title || 'Bli medlem';
    faqs = data.page?.faqs || FAQS_PLACEHOLDER;
    medlem = data.page?.medlem ||

    

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
        pageId: 'bli-medlem',
        page: {
          title,
          medlem
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
  <title>Bli medlem | Turf Västerbotten</title>
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
      <RichText multiLine bind:content={medlem} />
    </div>
  </div>
</div>


<Foreningen />

<Footer counter="/bli-medlem" />
