<script>
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import { fetchJSON } from '$lib/util';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import Testimonial from '$lib/components/Testimonial.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Image from '$lib/components/Image.svelte';
  import NotEditable from '$lib/components/NotEditable.svelte';
  import { currentUser, isEditing } from '$lib/stores.js';
  import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';

  export let data;

  // --------------------------------------------------------------------------
  // DEFAULT PAGE CONTENT - AJDUST TO YOUR NEEDS
  // --------------------------------------------------------------------------

const FAQS_PLACEHOLDER = `
  <h2>Fråga 1</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mi lectus, pellentesque nec urna eget, pretium dictum arcu. In rutrum pretium leo, id efficitur nisl ullamcorper sit amet.</p>
  <h2>Fråga 2</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mi lectus, pellentesque nec urna eget, pretium dictum arcu. In rutrum pretium leo, id efficitur nisl ullamcorper sit amet.</p>
`;

const TESTIMONIALS_PLACEHOLDER = [
  {
    text: '“Bara en zon till...”',
    image: '/images/person-placeholder.png',
    name: 'Turf Turfare · turfgame.com'
  }
];

  let title,
    testimonials,
    faqs,
    om,
    showUserMenu;

  function initOrReset() {
    $currentUser = data.currentUser;
    title = data.page?.title || 'Vad är Turf?';
    faqs = data.page?.faqs || FAQS_PLACEHOLDER;
    om = data.page?.om ||
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

    // Make a deep copy
    testimonials = JSON.parse(JSON.stringify(data.page?.testimonials || TESTIMONIALS_PLACEHOLDER));

    $isEditing = false;
  }

  // --------------------------------------------------------------------------
  // Page logic
  // --------------------------------------------------------------------------

  function toggleEdit() {
    $isEditing = true;
    showUserMenu = false;
  }

  function addTestimonial() {
    testimonials.push({
      text: '“Skriv ett citat här”',
      image: '/images/person-placeholder.jpg',
      name: 'Turf Turfare · example.com'
    });
    testimonials = testimonials; // trigger update
  }

  function deleteTestimonial(index) {
    testimonials.splice(index, 1);
    testimonials = testimonials; // trigger update
  }

  function moveTestimonial(index, direction) {
    let toIndex;
    if (direction === 'up' && index > 0) {
      toIndex = index - 1;
    } else if (direction === 'down' && index < testimonials.length - 1) {
      toIndex = index + 1;
    } else {
      return; // operation not possible
    }
    // Remove item from original position
    const element = testimonials.splice(index, 1)[0];
    // Insert at new position
    testimonials.splice(toIndex, 0, element);
    testimonials = testimonials; // trigger update
  }

  async function savePage() {
    try {
      // Only persist the start page when logged in as an admin
      if ($currentUser) {
        await fetchJSON('POST', '/api/save-page', {
          pageId: 'om-turf',
          page: {
            title,
            faqs,
            testimonials,
          }
        });
      }
      $isEditing = false;
    } catch (err) {
      console.error(err);
      alert('Något gick fel. Försök igen.');
    }
  }

  initOrReset();
</script>

<svelte:head>
  <title>Om Turf</title>
  <meta name="Turf" content="Turf är en sport som enklast kan liknas vid modern orientering." />
  <link rel="alternate" hreflang="en" href="https://www.turfvasterbotten.se/" />
  <link rel="canonical" href="https://www.turfvasterbotten.se/" />
</svelte:head>

<WebsiteHeader bind:showUserMenu on:cancel={initOrReset} on:save={savePage}>
  <PrimaryButton on:click={toggleEdit}>Redigera sida</PrimaryButton>
  <LoginMenu />
</WebsiteHeader>

<div>
  <div class="max-w-screen-md mx-auto px-6 pt-12 sm:pt-24">
    <h1 class="text-4xl md:text-7xl font-bold text-center">
      <PlainText bind:content={title} />
    </h1>
  </div>
</div>

<!-- FAQs -->
<div class="bg-white">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="font-bold text-sm sm:text-base pt-12 sm:pt-24 -mb-6 md:-mb-12">FAQs</div>
    <div class="prose md:prose-xl pb-12 sm:pb-24">
      <RichText multiLine bind:content={faqs} />
    </div>
  </div>
</div>

<div class="bg-white">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="font-bold text-sm sm:text-base py-12 sm:pt-24 pb-8"></div>
  </div>
  {#each testimonials as testimonial, i}
    <Testimonial
      bind:testimonial
      firstEntry={i === 0}
      lastEntry={i === testimonials.length - 1}
      on:delete={() => deleteTestimonial(i)}
      on:up={() => moveTestimonial(i, 'up')}
      on:down={() => moveTestimonial(i, 'down')}
    />
  {/each}

  {#if $isEditing}
    <div class="text-center pb-12 border-b border-gray-100">
      <SecondaryButton on:click={addTestimonial}>Lägg till citat</SecondaryButton>
    </div>
  {/if}
</div>

<Footer counter="/om-turf" />