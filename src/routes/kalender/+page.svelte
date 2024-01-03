<script>
  import { goto } from '$app/navigation';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import CaleventTeaser from '$lib/components/CaleventTeaser.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { currentUser } from '$lib/stores.js';
  import WebsiteHeader from '$lib/components/WebsiteHeader.svelte';
  import Foreningen from '../../lib/components/Foreningen.svelte';

  export let data;
  let showUserMenu;
  $: {
    $currentUser = data.currentUser;
  }
</script>

<svelte:head>
  <title>Kalender | Turf Västerbotten</title>
  <meta name="Turf Västerbotten" content="Kalender för det som är på gång i föreningen." />
</svelte:head>

<WebsiteHeader bind:showUserMenu>
  <div class="w-full flex flex-col space-y-4 p-4 sm:p-6">
    <PrimaryButton type="button" on:click={() => goto('/kalender/new')}>Ny händelse</PrimaryButton>
    <LoginMenu />
  </div>
</WebsiteHeader>

<div class="pb-8">
  <div class="max-w-screen-md mx-auto px-6 pt-12 sm:pt-24">
    <div class="font-bold text-sm">ALLA KALENDERHÄNDELSER</div>
    {#if data.calevents.length === 0}
      <div class="md:text-xl py-4">Inga händelser har publicerats än.</div>
    {/if}
  </div>

  {#each data.calevents as calevent, i}
    <CaleventTeaser {calevent} firstEntry={i === 0} />
  {/each}
</div>

<Foreningen />

<Footer counter="/kalender" />
