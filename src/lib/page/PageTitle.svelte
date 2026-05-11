<script>
  import IconButton from "$lib/button/IconButton.svelte";
  import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
    const {
        title,
        buttonLabel = '',
        buttonOnClick
    } = $props();
</script>

<div class="page-header">
  <h1>{title}</h1>
  {#if buttonLabel}
    <div class="button">
      <IconButton
        icon={faFileCirclePlus}
        label={buttonLabel}
        size="3x"
        onclick={buttonOnClick}
      />
    </div>
  {/if}
</div>

<style>
  .page-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
  }
  .page-header .button { font-size: 2em; }
</style>