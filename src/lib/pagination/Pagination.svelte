<script>
  import { createEventDispatcher } from 'svelte';

  export let page = 1;
  export let pageSize = 10;
  export let total = 0;

  const dispatch = createEventDispatcher();
  const pageSizes = [10, 25, 50, 100];

  $: totalPages = Math.ceil(total / pageSize) || 1;
  $: pages = getPages(page, totalPages);

function getPages(currentPage, totalPages) {
  const maxItems = 11;
  if (totalPages <= maxItems) {
    return Array.from(
      { length: totalPages },
      (_, i) => i + 1
    );
  }
  const pages = [];
  if (currentPage <= 6) {
    for (let i = 1; i <= 9; i++) { pages.push(i); }
    pages.push('...');
    pages.push(totalPages);
    return pages;
  }
  if (currentPage >= totalPages - 5) {
    pages.push(1);
    pages.push('...');
    for (let i = totalPages - 8; i <= totalPages; i++) { pages.push(i); }
    return pages;
  }
  pages.push(1);
  pages.push('...');
  for (let i = currentPage - 3; i <= currentPage + 3; i++) { pages.push(i); }
  pages.push('...');
  pages.push(totalPages);
  return pages;
}

  function changePage(p) { if (p !== page) { dispatch('change', { page: p, pageSize }); } }

  function changePageSize(e) {
    const size = Number(e.target.value);
    dispatch('change', { page: 1, pageSize: size });
  }

  function goFirst() { if (page > 1) { changePage(1); } }

  function goPrev() { if (page > 1) { changePage(page - 1); } }

  function goNext() { if (page < totalPages) { changePage(page + 1); } }

  function goLast() { if (page < totalPages) { changePage(totalPages); } }
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
    align-items: center;
    display: flex;
    gap: .25em;
  }

  button {
    cursor: pointer;
    padding: .3em .6em;
  }

  button.selected {
    background-color: #333;
    color: white;
    font-weight: bold;
  }

  .dots { padding: 0 .5em; }

  .size select { padding: .3em; }
</style>