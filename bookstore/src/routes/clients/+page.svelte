<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import ClientForm from '$lib/clients/ClientForm.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';

  let clientes = $state([
    {
      id: 1,
      name: 'Juan Pérez',
      nif: '12345678A',
      phone: 600123123,
      address: 'Calle Mayor 1'
    },
    {
      id: 2,
      name: 'María López',
      nif: '87654321B',
      phone: 699888777,
      address: 'Av. Andalucía 23'
    },
    {
      id: 3,
      name: 'Carlos Gómez',
      nif: '11223344C',
      phone: 611223344,
      address: 'Calle Granada 12'
    }
  ]);

  let clienteSeleccionado = $state(null);
  let search = $state('');

  function clienteCoincide(cliente) {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      cliente.name.toLowerCase().includes(q) ||
      cliente.nif.toLowerCase().includes(q)
    );
  }

  function editar(cliente) {
    clienteSeleccionado = cliente;
  }

  function cerrar() {
    clienteSeleccionado = null;
  }

  function guardar() {
    alert('El cliente ha sido editado');
    cerrar();
  }

  function eliminar() {
    clientes = clientes.filter(
      c => c.id !== clienteSeleccionado.id
    );
    cerrar();
  }
</script>

<h1>Clientes</h1>

<SearchBox
  value={search}
  placeholder="Buscar por nombre o NIF..."
  onChange={(v) => search = v}
/>

{#if clientes.filter(clienteCoincide).length === 0}
  <p>No se encontraron clientes.</p>
{/if}

{#each clientes.filter(clienteCoincide) as cliente}
  <Item>
    <div slot="image">
      <div class="avatar">{cliente.name[0]}</div>
    </div>

    <div slot="content">
      <div class="title">{cliente.name}</div>
      <div class="subtitle">{cliente.nif}</div>
      <div class="detail">
        Tel: {cliente.phone} | Dir: {cliente.address}
      </div>
    </div>

    <div slot="actions">
      <button type="button" onclick={() => editar(cliente)}>
        Editar
      </button>
    </div>
  </Item>
{/each}

{#if clienteSeleccionado}
  <AppModal
    title="Editar cliente"
    onSave={guardar}
    onDelete={eliminar}
    onCancel={cerrar}
  >
    <ClientForm client={clienteSeleccionado} />
  </AppModal>
{/if}

<style>
  .avatar {
    width: 40px;
    height: 40px;
    background: #2c3e50;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .title {
    font-weight: bold;
  }

  .subtitle {
    font-size: 0.85em;
    color: #666;
  }

  .detail {
    font-size: 0.85em;
    color: #444;
  }

  button {
    padding: 4px 8px;
  }
</style>