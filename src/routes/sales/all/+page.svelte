<script>
  import SalesList from '$lib/sales/SalesList.svelte';
  import { getSalesRange } from '$lib/api/sales.api.js';
  import { onMount } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faFilter } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/button/IconButton.svelte';

  let fromDate = $state(getTodayString());
  let toDate = $state(getTodayString());
  let sales = $state([]);
  let loading = $state(true);
  let error = $state(null);

  // Obtener la fecha de hoy en formato YYYY-MM-DD
  function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  async function loadSales() {
    try {
      loading = true;
      error = null;
      // Agregar time al rango de fechas para incluir todo el día
      const fromDateTime = new Date(fromDate);
      const toDateTime = new Date(toDate);
      toDateTime.setDate(toDateTime.getDate() + 1); // Incluir todo el día "to"
      
      sales = await getSalesRange(fromDateTime, toDateTime);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleFilter() { loadSales(); }

  function handleCloseDay() { }

  onMount(loadSales);
</script>

<h1>Ventas</h1>
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
<SalesList
  sales={sales}
  isLoading={loading}
  error={error}
/>

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
</style>