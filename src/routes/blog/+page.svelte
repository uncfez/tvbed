<script>
  import { goto } from '$app/navigation';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import ArticleTeaser from '$lib/components/ArticleTeaser.svelte';
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
  <title>Inlägg | Turf Västerbotten</title>
  <meta name="Turf Västerbotten" content="Allt du vill veta om Turf Västerbotten." />
</svelte:head>

<WebsiteHeader bind:showUserMenu>
  <div class="w-full flex flex-col space-y-4 p-4 sm:p-6">
    <PrimaryButton type="button" on:click={() => goto('/blog/new')}>Nytt inlägg</PrimaryButton>
    <LoginMenu />
  </div>
</WebsiteHeader>

<div class="pb-8">
  <div class="max-w-screen-md mx-auto px-6 pt-12 sm:pt-24">
    <div class="font-bold text-sm">ALLA INLÄGG</div>
    {#if data.articles.length === 0}
      <div class="md:text-xl py-4">Inga inlägg har publicerats än.</div>
    {/if}
  </div>

  {#each data.articles as article, i}
    <ArticleTeaser {article} firstEntry={i === 0} />
  {/each}
</div>

<Foreningen />

<Footer counter="/blog" />
