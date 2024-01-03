<script>
  import { classNames } from '$lib/util';
  import PrimaryButton from './PrimaryButton.svelte';
  import SecondaryButton from './SecondaryButton.svelte';
</script>

<div class={classNames('py-12 sm:py-24 border-t-2 border-gray-100')}>
  <div
    class="max-w-screen-md mx-auto px-6 flex flex-col sm:flex-row space-y-6 sm:space-x-8 sm:space-y-0"
  >
    <img
      class="flex-shrink-0 w-24 h-24"
      src="/images/person-placeholder.jpg"
      alt="Turf Västerbotten"
    />
    <div>
      <h2 class="text-3xl md:text-5xl font-bold">Turf Västerbotten</h2>
      <div class="mt-4 md:text-xl">
        Föreningen för turfare i Västerbotten.
      </div>
      <div class="pt-8 sm:pt-12">
        <PrimaryButton size="lg" href="/bli-medlem">Bli medlem</PrimaryButton>
        <SecondaryButton size="lg" href="/om">
          Om föreningen</SecondaryButton>
      </div>
    </div>
  </div>
</div>
