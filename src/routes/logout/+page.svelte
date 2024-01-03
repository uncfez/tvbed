<script>
  import Limiter from '$lib/components/Limiter.svelte';
  export let form;
</script>

<Limiter>
  <div class="pt-20">
    {#if form?.incorrect}
      <p class="p-4 bg-red-100 text-red-600 my-4 rounded-md">Något gick fel vid utloggningen.</p>
    {:else}
      Du är utloggad från redigeringsläget. <a class="underline" href="/">Fortsätt till förstasidan</a>.
    {/if}
  </div>
</Limiter>
