<script>
  import { extractTeaser, fetchJSON } from '$lib/util';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import WebsiteNav from '$lib/components/WebsiteNav.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';
  import CaleventTeaser from '$lib/components/CaleventTeaser.svelte';
  import Foreningen from '$lib/components/Foreningen.svelte';
  import Calevent from '$lib/components/Calevent.svelte';
  import NotEditable from '$lib/components/NotEditable.svelte';
  import EditorToolbar from '$lib/components/tools/EditorToolbar.svelte';
  import { currentUser, isEditing } from '$lib/stores';

  export let data;

  let showUserMenu = false;
  let title, teaser, content, published_at, updatedAt;

  $: {
    $currentUser = data.currentUser;
    initOrReset();
  }

  function initOrReset() {
    title = data.title;
    teaser = data.teaser;
    content = data.content;
    published_at = data.published_at;
    updatedAt = data.updatedAt;
    $isEditing = false;
  }

  function toggleEdit() {
    $isEditing = true;
    showUserMenu = false;
  }

  async function deleteCalevent() {
    if (!$currentUser) return alert('Sorry, you are not authorized.');
    try {
      fetchJSON('POST', '/api/delete-calevent', {
        slug: data.slug
      });
      goto('/kalender');
    } catch (err) {
      console.error(err);
      alert('Något gick fel när händelsen skulle raderas. Försök igen.');
      window.location.reload();
    }
  }

  async function saveCalevent() {
    if (!$currentUser) return alert('Sorry, you are not authorized.');
    const teaser = extractTeaser(document.getElementById('calevent_content'));
    try {
      const result = await fetchJSON('POST', '/api/update-calevent', {
        slug: data.slug,
        title,
        content,
        teaser
      });
      updatedAt = result.updatedAt;
      $isEditing = false;
    } catch (err) {
      console.error(err);
      alert(
        'Något gick fel. Du kan försöka igen men innan dess - för säkerhets skull - se till att kopiera och klistra in din text på en säker plats.'
      );
    }
  }
</script>

<svelte:head>
  <title>{title} | Turf Västerbotten</title>
  <meta name="description" content={teaser} />
  <meta name="og:image" property="og:image" content={data.teaser || data.bio.avatar} />
</svelte:head>

<EditorToolbar on:cancel={initOrReset} on:save={saveCalevent} />

<WebsiteNav bind:showUserMenu />
{#if showUserMenu}
  <Modal on:close={() => (showUserMenu = false)}>
    <form class="w-full block" method="POST">
      <div class="w-full flex flex-col space-y-4 p-4 sm:p-6">
        <PrimaryButton on:click={toggleEdit}>Redigera händelse</PrimaryButton>
        <PrimaryButton type="button" on:click={deleteCalevent}>Radera händelse</PrimaryButton>
        <LoginMenu />
      </div>
    </form>
  </Modal>
{/if}

<Calevent bind:title bind:content bind:published_at />

{#if data.calevents.length > 0}
  <NotEditable>
    <div class="border-t-2 border-gray-100">
      <div class="max-w-screen-md mx-auto px-6 pt-8 sm:pt-12">
        <div class="font-bold text-sm">NÄSTA HÄNDELSE</div>
      </div>
      {#each data.calevents as calevent, i}
        <CaleventTeaser {calevent} firstEntry={i === 0} />
      {/each}
    </div>
  </NotEditable>
{/if}

<NotEditable>
  <Foreningen />
</NotEditable>

<Footer counter={`/kalender/${data.slug}`} />
