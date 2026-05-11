<script>
  import SaleRow from '$lib/sales/SaleRow.svelte';
  import { getSales } from '$lib/api/sales.api.js';
  import { onMount } from 'svelte';

  let sales = $state([]);
  let loading = $state(true);
  let error = $state(null);

  onMount(async () => {
    try {
      const response = await getSales();
      sales = response;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<h1>Ventas</h1>

{#if loading}
  <p>Cargando...</p>
{:else if error}
  <p style="color: red;">{error}</p>
{:else if sales.length === 0}
  <p>No hay ventas registradas.</p>
{:else}
  {#each sales as sale}
    <SaleRow sale={sale} />
  {/each}
{/if}