<script>
  import Limiter from '$lib/components/Limiter.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import Input from '$lib/components/Input.svelte';
  export let form;
</script>

<svelte:head>
  <title>Login | Turf Västerbotten</title>
</svelte:head>

<Limiter>
  {#if form?.incorrect}
    <p class="p-4 bg-red-100 text-red-600 my-4 rounded-md">Felaktig inloggning. Försök igen.</p>
  {/if}
  <div class="w-full flex flex-col space-y-4 mt-12 mb-4">
    <form method="POST" class="flex flex-col space-y-8">
      <!-- <div class="flex flex-col">
				<label for="email" class="font-semibold mb-2">E-Mail</label>
				<Input type="text" name="email" id="email" />
			</div> -->
      <div class="flex flex-col">
        <label for="password" class="font-semibold mb-2 text-2xl">Ange lösenord</label>
        <Input type="password" name="password" id="password" />
      </div>
      <PrimaryButton type="submit">Logga in</PrimaryButton>
      <div><a class="underline" href="/">Tillbaka till hemsidan</a></div>
    </form>
  </div>
</Limiter>
