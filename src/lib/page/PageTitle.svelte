<script>
  import IconButton from "$lib/button/IconButton.svelte";
  import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
    const {
        title,
        buttonLabel = '',
        buttonOnClick,
        children
    } = $props();
</script>

<div class="page-header">
  <h1>{title}</h1>
  {#if children}
    <div class="center-content">
      {@render children()}
    </div>
  {/if}
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
    gap: 1em;
    margin-bottom: 2em;
  }

  h1 {
    margin: 0;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .center-content {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .page-header .button {
    font-size: 2em;
    flex-shrink: 0;
  }
</style>