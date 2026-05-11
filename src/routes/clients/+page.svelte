<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import ClientForm from '$lib/clients/ClientForm.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';
  import IconButton from '$lib/button/IconButton.svelte';
  import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
  import {
    getClients,
    searchClientsByName,
    createClient,
    updateClient,
    deleteClient
  } from '$lib/api/clients.api.js';

  let clientes = $state([]);
  let clienteSeleccionado = $state(null);
  let errores = $state({});
  let search = $state('');
  let loading = $state(false);
  let error = $state(null);
  let searchTimeout;

  // =======================
  // LOAD CLIENTS
  // =======================
  async function loadClients() {
    loading = true;
    error = null;

    try {
      clientes = await getClients();
    } finally {
      loading = false;
    }
  }

  loadClients();

  // =======================
  // SEARCH
  // =======================
  function handleSearch(value) {
    search = value;
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
      const cleaned = value.trim().replace(/[^a-zA-Z0-9]/g, '');

      if (cleaned.length === 0) {
        loadClients();
        return;
      }

      if (cleaned.length < 3) return;

      loading = true;
      try {
        clientes = await searchClientsByName(value);
      } finally {
        loading = false;
      }
    }, 200);
  }

  // =======================
  // ACTIONS
  // =======================
  function nuevo() {
    errores = {};
    clienteSeleccionado = {
      name: '',
      nif: '',
      phone: '',
      address: ''
    };
  }

  function editar(cliente) {
    errores = {};
    clienteSeleccionado = { ...cliente };
  }

  function cerrarModal() {
    clienteSeleccionado = null;
    errores = {};
  }

  function validarCliente(c) {
    const e = {};
    if (!c.name?.trim()) e.name = 'El nombre es obligatorio';
    if (!c.nif?.trim()) e.nif = 'El NIF es obligatorio';
    return e;
  }

  async function guardar() {
    const e = validarCliente(clienteSeleccionado);
    errores = e;

    if (Object.keys(e).length > 0) return;

    if (clienteSeleccionado.id) {
      await updateClient(clienteSeleccionado);
    } else {
      await createClient(clienteSeleccionado);
    }

    cerrarModal();
    loadClients();
  }

  async function eliminar(cliente) {
    if (!confirm('¿Eliminar este cliente?')) return;
    await deleteClient(cliente.id);
    loadClients();
  }
</script>

<!-- HEADER -->
<div class="page-header">
  <h1>Clientes</h1>
  <button onclick={nuevo} class="blue">Nuevo cliente</button>
</div>
<div class="search-box">
  <SearchBox
  value={search}
  placeholder="Buscar cliente..."
  onChange={handleSearch}
/>
</div>

{#if loading}
  <p>Cargando clientes…</p>
{/if}

{#if error}
  <p class="error">{error}</p>
{/if}

<div class="item-container">
  {#each clientes as cliente}
    <Item>
      <div slot="image">👤</div>

      <div slot="content">
        <div class="title">{cliente.name}</div>
        <div class="subtitle">{cliente.nif}</div>
        <div class="detail">
          Tel: {cliente.phone} <br />
          Dir: {cliente.address}
        </div>
      </div>

      <div slot="actions" class="button-container">
        <IconButton icon={faEdit} label="Editar" onclick={() => editar(cliente)} variant="primary" />
        <IconButton icon={faTrash} label="Eliminar" onclick={() => eliminar(cliente)} variant="danger" />
      </div>
    </Item>
  {/each}
</div>

{#if clienteSeleccionado}
  <AppModal
    title={clienteSeleccionado.id ? 'Editar cliente' : 'Nuevo cliente'}
    onSave={guardar}
    onCancel={cerrarModal}
    actionsAlign="right"
  >
    <ClientForm
      key={clienteSeleccionado.id ?? 'new'}
      client={clienteSeleccionado}
      errors={errores}
      onChange={(c) => (clienteSeleccionado = c)}
    />
  </AppModal>
{/if}

<style>
  .search-box {
    display: flex;
    justify-content: center;
    margin-bottom: 2em;
  }
  
  .item-container {    
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(25em, 1fr));
  }

  .title {
    font-weight: bold;
    margin-bottom: 1em;
  }
  .subtitle {
    font-size: 0.85em;
    color: #666;
  }
  .detail {
    font-size: 0.85em;
    color: #444;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .error { color: red; }

  .button-container {
    display: flex;
    flex-direction: column;
    gap: .5em;
  }
</style>