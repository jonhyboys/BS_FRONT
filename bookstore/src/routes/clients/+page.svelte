<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import ClientForm from '$lib/clients/ClientForm.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';

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
  <button onclick={nuevo}>Nuevo cliente</button>
</div>

<SearchBox
  value={search}
  placeholder="Buscar cliente..."
  onChange={handleSearch}
/>

{#if loading}
  <p>Cargando clientes…</p>
{/if}

{#if error}
  <p class="error">{error}</p>
{/if}

{#each clientes as cliente}
  <Item>
    <div slot="image">👤</div>

    <div slot="content">
      <div class="title">{cliente.name}</div>
      <div class="subtitle">{cliente.nif}</div>
      <div class="detail">
        Tel: {cliente.phone} | Dir: {cliente.address}
      </div>
    </div>

    <div slot="actions">
      <button onclick={() => editar(cliente)}>Editar</button>
      <button onclick={() => eliminar(cliente)}>Eliminar</button>
    </div>
  </Item>
{/each}

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
  .page-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .error {
    color: red;
  }
</style>