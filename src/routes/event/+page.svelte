<script>
  import Footer from '$lib/components/Footer.svelte';
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';
  import { fetchJSON } from '$lib/util';
  import { currentUser, isEditing } from '$lib/stores.js';
  import Testimonial from '$lib/components/Testimonial.svelte';
  import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';
  import Foreningen from '../../lib/components/Foreningen.svelte';

  export let data;

  const FAQS_PLACEHOLDER = `
		<h2>Question 1</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mi lectus, pellentesque nec urna eget, pretium dictum arcu. In rutrum pretium leo, id efficitur nisl ullamcorper sit amet.</p>
    <h2>Question 2</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mi lectus, pellentesque nec urna eget, pretium dictum arcu. In rutrum pretium leo, id efficitur nisl ullamcorper sit amet.</p>
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
    event,
    testimonials,
    faqs;

  // --------------------------------------------------------------------------
  // DEFAULT PAGE CONTENT - AJDUST TO YOUR NEEDS
  // --------------------------------------------------------------------------

  function initOrReset() {
    $currentUser = data.currentUser;
    title = data.page?.title || 'Event';
    faqs = data.page?.faqs || FAQS_PLACEHOLDER;

    // Make a deep copy
    testimonials = JSON.parse(JSON.stringify(data.page?.testimonials || TESTIMONIALS_PLACEHOLDER));

    event = data.page?.event ||
    

      [
        ['Event',
          'Föreningen för Turfare i Västerbotten',
          'turfvasterbotten.se'].join('<br/>'),
        [
          'Föreningen Turf Västerbotten',
          'BankGiro: 5353–0572',
          'Swish: 123 242 91 40',
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
    if (!$currentUser) return alert('Sorry, you are not authorized.');
    try {
      fetchJSON('POST', '/api/save-page', {
        pageId: 'event',
        page: {
          title,
          faqs,
          testimonials,
          event
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
  <title>Turf-event | Turf Västerbotten</title>
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
    <div class="prose md:prose-xl pb-0 sm:pb-0">
      <RichText multiLine bind:content={event} />
    </div>
  </div>
</div>

<!-- FAQs -->
<div class="bg-white">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="font-bold text-sm sm:text-base pt-0 sm:pt-0 -mb-6 md:-mb-12">FAQs</div>
    <div class="prose md:prose-xl pb-12 sm:pb-12">
      <RichText multiLine bind:content={faqs} />
    </div>
  </div>
</div>

<div class="bg-white border-t-2 border-gray-100 pb-10 sm:pb-16">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="font-bold text-sm sm:text-base py-12 sm:pt-24 pb-8">TURF-CITAT</div>
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

<Foreningen />

<Footer counter="/event" />
