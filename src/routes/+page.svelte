<script>
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import { fetchJSON } from '$lib/util';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import ArticleTeaser from '$lib/components/ArticleTeaser.svelte';
  import CaleventTeaser from '$lib/components/CaleventTeaser.svelte';
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
  const EMAIL = 'styrelsen@turfvasterbotten.se';

  // Can contain spaces but must not contain the + sign
  const PHONE_NUMBER = '';

  const FAQS_PLACEHOLDER = `
		<h2>Question 1</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mi lectus, pellentesque nec urna eget, pretium dictum arcu. In rutrum pretium leo, id efficitur nisl ullamcorper sit amet.</p>
    <h2>Question 2</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mi lectus, pellentesque nec urna eget, pretium dictum arcu. In rutrum pretium leo, id efficitur nisl ullamcorper sit amet.</p>
	`;

  const BIO_PLACEHOLDER = `
		<p><strong>Turf Västerbotten</strong> är en ideell förening som är religiöst och politiskt obunden. Föreningens syfte är att organisera och sammanhålla medlemmar som utövar sporten Turf inom Västerbottens län (Region Västerbotten).</p>
    <p>Föreningen ordnar bland annat de stående eventen <strong>Västerbotten Winter Classic</strong> och <strong>Västerbotten Midnight Classic</strong>, samt regelbundna turf-träffar.</p>
    <p>Turf Västerbotten grundades den 4 maj 2019.</p>
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
    bioTitle,
    bioPicture,
    bio,
    showUserMenu;

  function initOrReset() {
    $currentUser = data.currentUser;
    title = data.page?.title || 'Turf Västerbotten';
    faqs = data.page?.faqs || FAQS_PLACEHOLDER;

    // Make a deep copy
    testimonials = JSON.parse(JSON.stringify(data.page?.testimonials || TESTIMONIALS_PLACEHOLDER));

    bioPicture = data.page?.bioPicture || '/images/person-placeholder.jpg';
    bioTitle = data.page?.bioTitle || "Turf Västerbotten — Föreningen för turfare i Västerbotten";
    bio = data.page?.bio || BIO_PLACEHOLDER;
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
          pageId: 'home',
          page: {
            title,
            faqs,
            testimonials,
            bioPicture,
            bioTitle,
            bio
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
  <title>Turf Västerbotten</title>
  <meta name="description" content="Föreningen för turfare i Västerbotten" />
  <link rel="alternate" hreflang="se" href="https://www.turfvasterbotten.se/" />
  <link rel="canonical" href="https://www.turfvasterbotten.se/e" />
</svelte:head>

<WebsiteHeader bind:showUserMenu on:cancel={initOrReset} on:save={savePage}>
  <PrimaryButton on:click={toggleEdit}>Redigera sida</PrimaryButton>
  <LoginMenu />
</WebsiteHeader>

<div>
  <div class="max-w-screen-md mx-auto px-6 pt-12 sm:pt-24">
    <NotEditable>
      <img
        class="pb-8 w-14 sm:w-40 mx-auto"
        viewBox="0 0 200 200"
        fill="none"
        src="images/person-placeholder.jpg"
        alt="Turf Västerbotten"
        />
    </NotEditable>
    <h1 class="text-4xl md:text-7xl font-bold text-center">
      <PlainText bind:content={title} />
    </h1>
    <NotEditable>
      <div class="text-center pt-8 pb-4 bounce text-xl">↓</div>
      <div class="text-center">
        <PrimaryButton size="lg" href="/bli-medlem" >Bli medlem</PrimaryButton>
      </div>
    </NotEditable>
  </div>
</div>

{#if data.articles.length > 0}
  <NotEditable>
      <div class="max-w-screen-md mx-auto px-6 pt-12 sm:pt-24">
        <div class="font-bold text-sm sm:text-base">SENASTE INLÄGGEN</div>
      {#each data.articles as article, i}
        <ArticleTeaser {article} firstEntry={i === 0} />
      {/each}
    </div>
    <div class="text-center pb-10">
      <PrimaryButton size="sm" href="/blog" >Alla inlägg</PrimaryButton>
    </div>
  </NotEditable>
{/if}

{#if data.calevents.length > 0}
  <NotEditable>
    <div class="bg-white border-t-2 border-gray-100 pb-10 sm:pb-16"></div>
      <div class="max-w-screen-md mx-auto px-6 pt-0 sm:pt-0">
        <div class="font-bold text-sm sm:text-base">FRÅN KALENDERN</div>
      {#each data.calevents as calevent, i}
        <CaleventTeaser {calevent} firstEntry={i === 0} />
      {/each}
    </div>
  </NotEditable>
{/if}

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

<!-- FAQs -->
<div class="bg-white">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="font-bold text-sm sm:text-base pt-12 sm:pt-24 -mb-6 md:-mb-12">FAQs</div>
    <div class="prose md:prose-xl pb-12 sm:pb-24">
      <RichText multiLine bind:content={faqs} />
    </div>
  </div>
</div>

<!-- Bio -->
<div id="contact" class="bg-white border-t-2 border-b-2 border-gray-100 pb-12 sm:pb-24">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="pt-12 sm:pt-24 pb-12 text-center">
      <div class="w-48 h-48 md:w-72 md:h-72 mx-auto overflow-hidden">
        <Image
          class="block w-48 h-48 md:w-72 md:h-72"
          maxWidth="384"
          maxHeight="384"
          quality="0.8"
          bind:src={bioPicture}
          alt="Turf Västerbotten"
        />
      </div>

    </div>
    <div class="">
      <h1 class="text-3xl md:text-5xl font-bold">
        <PlainText bind:content={bioTitle} />
      </h1>
    </div>
    <div class="prose md:prose-xl pb-6">
      <RichText multiLine bind:content={bio} />
    </div>

    <NotEditable>
      <div class="flex flex-col sm:flex-row sm:space-x-6 md:space-x-8 space-y-4 sm:space-y-0">
        <PrimaryButton size="lg" href="/bli-medlem">Bli medlem</PrimaryButton>
        <SecondaryButton size="lg" href="/om">
          Om föreningen
        </SecondaryButton>
      </div>
    </NotEditable>
  </div>
</div>

<Footer counter="/" />
