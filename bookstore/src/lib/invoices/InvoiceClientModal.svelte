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

      // ⛔ no mostrar nada
      if (cleaned.length < 3) {
        clients = [];
        return;
      }

      loading = true;
      try {
        clients = await searchClientsByName(value);
      } finally {
        loading = false;
      }
    }, 200);
  }

  // cuando se cierra el modal, limpiamos estado
  $effect(() => {
    if (!isOpen) {
      reset();
    }
  });
</script>

{#if isOpen}
  <AppModal
    title="Seleccionar cliente"
    onCancel={onCancel}
    actionsAlign="right"
  >
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
          <button onclick={() => onSelect(client)}>
            Seleccionar
          </button>
        </div>
      </Item>
    {/each}
  </AppModal>
{/if}