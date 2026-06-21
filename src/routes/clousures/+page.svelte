<script>
  import SalesList from '$lib/sales/SalesList.svelte';
  import { getClousuresRange } from '$lib/api/clousures.api.js';
  import { getSalesByClousure } from '$lib/api/sales.api.js';
  import { onMount } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faFilter, faSquareCaretDown, faSquareCaretUp } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/button/IconButton.svelte';

  let fromDate = $state(getTodayString());
  let toDate = $state(getTodayString());
  let clousures = $state([]);
  let loading = $state(true);
  let error = $state(null);
  let saleLoading = $state(false);
  let saleError = $state(null);
  let sales = $state({});

  function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  async function loadClousures() {
    try {
      loading = true;
      error = null;
      const fromDateTime = new Date(fromDate);
      const toDateTime = new Date(toDate);
      toDateTime.setDate(toDateTime.getDate() + 1);      
      clousures = await getClousuresRange(fromDateTime, toDateTime);
    }
    catch (err) { error = err.message; }
    finally { loading = false; }
  }

  function handleFilter() { loadClousures(); }

  function handleCloseDay() { }

  onMount(loadClousures);

  function formatDate(date) {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  async function handle_view_sales(clousure) {
    try {
      saleLoading = true;
      saleError = null;
      sales[clousure.id] = await getSalesByClousure(clousure.id);
    }
    catch (err) { saleError = err.message; }
    finally { saleLoading = false; }
  }

  function handleCloseSales(clousure) { sales[clousure.id] = undefined; }
</script>

<h1>Cierres</h1>
<div class="filters">
  <div class="dates">
    <div class="date-group">
      <label for="from-date">Desde:</label>
      <input id="from-date" type="date" bind:value={fromDate} />
    </div>
    <div class="date-group">
      <label for="to-date">Hasta:</label>
      <input id="to-date" type="date" bind:value={toDate} />
    </div>
  </div>
  <IconButton size="2x" icon={faFilter} label="Filtrar" onclick={handleFilter} />
</div>
{#if loading}<p>Cargando cierres...</p>
{:else if error}
  <p>Error: {error}</p>
{:else if clousures.length === 0}
  <p>No se encontraron cierres en el rango seleccionado.</p>
{:else}
  <ul>
    {#each clousures as clousure}
      <li>
        <div class="summary">
          <div>Fecha: {formatDate(clousure.date)} 
            {#if !sales[clousure.id]}
              | Número de ventas: {clousure.saleIds.length} | Monto: {clousure.amount}
            {/if}
          </div>
          <div class="actions">
            {#if sales[clousure.id] && sales[clousure.id].length > 0}
              <IconButton size="2x" icon={faSquareCaretUp} label="Cerrar ventas" onclick={() => handleCloseSales(clousure)} />
            {:else}
              <IconButton size="2x" icon={faSquareCaretDown} label="Ver ventas" onclick={() => handle_view_sales(clousure)} />
            {/if}
          </div>
        </div>
        {#if sales[clousure.id] !== undefined && sales[clousure.id] !== null && sales[clousure.id].length > 0}
          <div class="details">
            <SalesList
              sales={sales[clousure.id]}
              isLoading={saleLoading}
              error={saleError}
            />
          </div>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .filters {
    align-items: center;
    display: flex;
    gap: 1em;
    justify-content: flex-end;
    margin-bottom: 2em;
    padding: 0 1em;
  }

  .dates {
    display: flex;
    gap: 1em;
  }

  .date-group {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  .date-group label {
    font-weight: 600;
    font-size: 0.9em;
  }

  .date-group input {
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9em;
    padding: 0.5em;
  }

  li {
    border: 1px solid #ccc;
    margin-bottom: 0.5em;
    padding: 0.5em;
  }

  .summary {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
</style>