<script>
  import Item from '$lib/list/Item.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';
  import { searchClientsByName } from '$lib/api/clients.api.js';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import IconButton from "$lib/button/IconButton.svelte";
  import { faSquareCheck, faUserTag } from '@fortawesome/free-solid-svg-icons';

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
      <div slot="image">
        <FontAwesomeIcon icon={faUserTag} />
      </div>
      <div slot="content">
        <div class="title">{client.name}</div>
        <div class="subtitle">{client.nif}</div>
        <div class="detail">{client.phone} | {client.address}</div>
      </div>
      <div slot="actions">
        <IconButton icon={faSquareCheck} label="Seleccionar" size="2x" onclick={() => onSelect(client)} />
      </div>
    </Item>
  {/each}
</div>

<style>
 .body { 
    margin: 1em 0;
    min-width: 30em;
  }

 p {
    text-align: center;
    margin: 2em;
 }

 .title {
    font-weight: bold;
    font-size: 1.2em;
 }

 .detail {
    color: #666;
    font-size: 0.8em;
    font-style: italic;
    margin-top: 0.8em;
 }
</style>