<script>
  import Item from '$lib/list/Item.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';
  import { searchClientsByName } from '$lib/api/clients.api.js';
  import IconButton from "$lib/button/IconButton.svelte";
  import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';

  let { onSelect } = $props();
  let clients = $state([]);
  let search = $state('');
  let loading = $state(false);
  let searchTimeout;

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
  {#if clients.length === 0}
    <p>Use el buscador para encontrar clientes.</p>
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
        <IconButton icon={faSquareCheck} label="Seleccionar" sixe="2x" onclick={() => onSelect(client)} />
      </div>
    </Item>
  {/each}
</div>

<style>
 .body { 
  margin: 1em 0;
  min-width: 45em;
}

 p {
    text-align: center;
    margin: 2em;
 }
</style>