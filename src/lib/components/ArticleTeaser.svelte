<script>
  export let article;
  export let firstEntry;
  import { classNames, formatDate } from '$lib/util';
  import SecondaryButton from './SecondaryButton.svelte';

  $: teaser_image = JSON.parse(article.teaser_image);
  const lf = new Intl.ListFormat('en');
</script>

<div>
  <div
    class={classNames(
      'max-w-screen-md mx-auto px-6 md:text-xl',
      firstEntry ? 'pt-2 pb-8 sm:pb-12' : 'py-6 sm:py-10'
    )}
  >
    <div class={classNames(article.published_at ? '' : 'opacity-50')}>
      <div>
        <a
          class={classNames('mb-12 text-2xl md:text-3xl font-bold')}
          href={`/blog/${article.slug}`}
        >
          {article.title}
        </a>
      </div>
      {#if teaser_image?.src && teaser_image?.width && teaser_image?.height}
      <a href={`/blog/${article.slug}`}>
        <img
          class="block w-full mt-4"
          src={teaser_image.src}
          width={teaser_image.width}
          height={teaser_image.height}
          alt={article.title}
        />
      </a>
    {/if}
      <div class="pt-2 pb-4">
        <div class={teaser_image?.src ? 'line-clamp-3' : 'line-clamp-5'}></div>
        <div class="line-clamp-4">
          <a href={`/blog/${article.slug}`}>
            <span class="font-bold">{formatDate(article.published_at)}</span> — {article.teaser}
          </a>
        </div>
      </div>
    </div>
    <div class="pt-2">
      <SecondaryButton size="sm" href={`/blog/${article.slug}`}>
        Läs mer →
      </SecondaryButton>
    </div>
  </div>
</div>
