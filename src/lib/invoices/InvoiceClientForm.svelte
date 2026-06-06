<script>
  import AppModal from '$lib/modal/AppModal.svelte';
  import Item from '$lib/list/Item.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';
  import { searchClientsByName } from '$lib/api/clients.api.js';

  let { isOpen, onSelect, onCancel } = $props();
  let clients = $state([]);
  let search = $state('');
  let loading = $state(false);
  let searchTimeout;

  function reset() {
    clients = [];
    search = '';
  }

  function handleSearch(value) {
    search = value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      const cleaned = value
        .trim()
        .replace(/[^a-zA-Z0-9]/g, '');
      if (cleaned.length < 3) {
        clients = [];
        return;
      }
      loading = true;
      try { clients = await searchClientsByName(value); }
      finally { loading = false; }
    }, 200);
  }
  
  $effect(() => { if (!isOpen) { reset(); } });
</script>


<div class="body">
  <SearchBox
    value={search}
    placeholder="Buscar cliente..."
    onChange={handleSearch}
  />
  {#if loading}
    <p>Cargando clientes…</p>
  {/if}
  {#each clients as client}
    <Item>
      <div slot="image">👤</div>
      <div slot="content">
        <div class="title">{client.name}</div>
        <div class="subtitle">{client.nif}</div>
        <div class="detail">
          Tel: {client.phone} | Dir: {client.address}
        </div>
      </div>
      <div slot="actions">
        <button onclick={() => onSelect(client)}>Seleccionar</button>
      </div>
    </Item>
  {/each}
</div>

<style>
 .body { margin: 1em 0; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    padding: 0.5em 0;
  }

  .form-group label { font-weight: 600; }

  .form-group input { padding: 0.5em; }
</style>