<script>
  import { createEventDispatcher } from 'svelte';

  export let page = 1;
  export let pageSize = 10;
  export let total = 0;

  const dispatch = createEventDispatcher();
  const pageSizes = [10, 25, 50, 100];
  const delta = 2;

  $: totalPages = Math.ceil(total / pageSize) || 1;
  $: pages = getPages(page, totalPages);

  function getPages(currentPage, totalPages) {
    const result = [];
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    if (totalPages <= 1) { return [1]; }
    if (start > 1) { result.push(1); }
    if (start > 2) { result.push('...'); }
    for (let i = start; i <= end; i++) { result.push(i); }
    if (end < totalPages - 1) { result.push('...'); }
    if (end < totalPages) { result.push(totalPages); }
    return result;
}

  function changePage(p) {
    if (p === '...' || p === page) { return; }
    dispatch('change', { page: p, pageSize });
  }

  function changePageSize(e) {
    const size = Number(e.target.value);
    dispatch('change', { page: 1, pageSize: size });
  }

  function goFirst() {
    if (page > 1) { changePage(1); }
  }

  function goPrev() {
    if (page > 1) { changePage(page - 1); }
  }

  function goNext() {
    if (page < totalPages) { changePage(page + 1); }
  }

  function goLast() {
    if (page < totalPages) { changePage(totalPages); }
  }
</script>

<div class="pagination">
  <div class="info">Total: {total} | Página {page} de {totalPages}</div>
  <div class="controls">
    <button on:click={goFirst} disabled={page === 1}>⏮</button>
    <button on:click={goPrev} disabled={page === 1}>◀</button>
    {#each pages as p}
      {#if p === '...'}
        <span class="dots">...</span>
      {:else}
        <button class:selected={p === page} on:click={() => changePage(p)}>{p}</button>
      {/if}
    {/each}
    <button on:click={goNext} disabled={page === totalPages}>▶</button>
    <button on:click={goLast} disabled={page === totalPages}>⏭</button>
  </div>
  <div class="size">
    <select bind:value={pageSize} on:change={changePageSize}>
      {#each pageSizes as size}
        <option value={size}>{size}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .pagination {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: space-between;
    margin: 1em 0;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: .25em;
  }

  button {
    padding: .3em .6em;
    cursor: pointer;
  }

  button.selected {
    background-color: #333;
    color: white;
    font-weight: bold;
  }

  .dots {
    padding: 0 .5em;
  }

  .size select {
    padding: .3em;
  }
</style>