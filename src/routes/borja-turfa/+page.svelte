<script>
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import { fetchJSON } from '$lib/util';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import Testimonial from '$lib/components/Testimonial.svelte';
  import IntroStep from '$lib/components/IntroStep.svelte';
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
    introStep1,
    introStep2,
    introStep3,
    introStep4,
    bioTitle,
    bioPicture,
    bio,
    showUserMenu;

  function initOrReset() {
    $currentUser = data.currentUser;
    title = data.page?.title || 'Så här gör du för att turfa!';
    faqs = data.page?.faqs || FAQS_PLACEHOLDER;

    // Make a deep copy
    testimonials = JSON.parse(JSON.stringify(data.page?.testimonials || TESTIMONIALS_PLACEHOLDER));

    introStep1 = JSON.parse(
      JSON.stringify(
        data.page?.introStep1 || {
          label: 'TURF ÄR FÖR VISSA ETT MOBILSPEL, FÖR ANDRA ÄR DET EN MOTIONSFORM, ELLER TILL OCH MED EN LIVSSTIL',
          title: 'Ladda ner Turf-appen',
          description: 'För att spela behöver du ladda ner appen Turf till din telefon. Appen är gratis.'
        }
      )
    );
    introStep2 = JSON.parse(
      JSON.stringify(
        data.page?.introStep2 || {
          label: 'TURF KAN BESKRIVAS SOM ETT GPS-SPEL, DÄR ORIENTERING MÖTER GEOCACHING OCH POKEMON GO.',
          title: 'Välj ett "nick"',
          description: 'Välj ett nickname och bege dig ut i din närmiljö. Cykla, rulla, gå, spring eller åk skidor. Du kan spela själv eller tillsammans med vänner.'
        }
      )
    );
    introStep3 = JSON.parse(
      JSON.stringify(
        data.page?.introStep3 || {
          label: 'TURF GÅR UT PÅ ATT DU SKA BEGE DIG TILL ZONER SOM DU SER PÅ KARTAN I APPEN',
          title: 'Ta en zon, eller fler',
          description: 'Genom att erövra platsen från andra spelare får du poäng. Ju fler poäng, desto snabbare stiger du i rankerna och på topplistan. Du väljer själv om du vill kämpa om världsvinsten, Västerbottens-pokalen eller utmana dig själv. '
        }
      )
    );
    introStep4 = JSON.parse(
      JSON.stringify(
        data.page?.introStep4 || {
          label: 'VILL DU BÖRJA SPELA DIREKT ELLER VETA MER',
          title: 'Besök turfgame.com eller läs mer här på Turf Västerbottens hemsida',
          description: 'Föreningen ordnar bland annat regelbundna turf-träffar samt de stående eventen Västerbotten Winter Classic och Västerbotten Midnight Classic.'
        }
      )
    );
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
          pageId: 'turf',
          page: {
            title,
            faqs,
            testimonials,
            introStep1,
            introStep2,
            introStep3,
            introStep4,
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

<div class="pt-12 md:pt-24 border-gray-100 border-b-2">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="relative">
      <div class="w-1 bg-gray-900 absolute inset-0 -top-8 bottom-12 mx-auto z-0">
        <div class="w-4 h-4 rounded-full bg-gray-900 absolute -top-1 -left-[6px]" />
      </div>
      <div class="z-10">
        <IntroStep bind:intro={introStep1} />
        <IntroStep bind:intro={introStep2} />
        <IntroStep bind:intro={introStep3} />
        <IntroStep bind:intro={introStep4} />
      </div>
    </div>
    <div class="relative h-14">
      <div class="w-1 bg-gray-900 absolute inset-0 -top-16 bottom-12 mx-auto z-0">
        <div
          class="absolute -bottom-2 -left-[7px] h-0 w-0 border-x-[9px] border-x-transparent border-t-[10px] border-gray-900"
        />
      </div>
    </div>
    <div class="text-center mb-32">
      <PrimaryButton size="lg"
        type="button"
        on:click={() =>
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >Ladda ner Turf-appen</PrimaryButton
      >
    </div>
  </div>
</div>

<div class="bg-white pb-6 sm:pb-12">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="font-bold text-sm sm:text-base py-12 sm:pt-24 pb-8">WHAT PEOPLE SAY</div>
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

<!-- Bio -->
<div id="contact" class="bg-white border-t-2 border-b-2 border-gray-100 pb-12 sm:pb-24">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="pt-12 sm:pt-24 pb-12 text-center">
      <div class="w-48 h-48 md:w-72 md:h-72 mx-auto overflow-hidden relative rounded-full">
        <Image
          class="block w-48 h-48 md:w-72 md:h-72 rounded-full"
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
        <PrimaryButton size="lg" href={`mailto:${EMAIL}`}>Bli medlem</PrimaryButton>
        <SecondaryButton size="lg" href="/om">
          Läs mer om föreningen
        </SecondaryButton>
      </div>
    </NotEditable>
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

<Footer counter="/" />