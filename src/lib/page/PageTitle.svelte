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
    <div class="center-content">{@render children()}</div>
  {/if}
  {#if buttonLabel}
    <div>
      <IconButton icon={faFileCirclePlus} label={buttonLabel} size="3x" onclick={buttonOnClick} />
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

  .center-content { flex: 1; }
</style>