<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import ClientForm from '$lib/clients/ClientForm.svelte';

  let clientes = $state([
    {
      id: 1,
      nif: '12345678A',
      name: 'Juan Pérez',
      phone: 600123123,
      address: 'Calle Mayor 1'
    },
    {
      id: 2,
      nif: '87654321B',
      name: 'María López',
      phone: 699888777,
      address: 'Av. Andalucía 23'
    }
  ]);

  let clienteSeleccionado = $state(null);

  function editar(cliente) {
    clienteSeleccionado = cliente;
  }

  function cerrarModal() {
    clienteSeleccionado = null;
  }

  function guardar() {
    alert('El cliente ha sido editado');
    cerrarModal();
  }

  function eliminar() {
    clientes = clientes.filter(
      c => c.id !== clienteSeleccionado.id
    );
    cerrarModal();
  }
</script>

<h1>Clientes</h1>

{#each clientes as cliente}
  <Item>
    <!-- IMAGE -->
    <div slot="image">
      <div class="avatar">
        {cliente.name.charAt(0)}
      </div>
    </div>

    <!-- CONTENT -->
    <div slot="content">
      <div class="header">
        <div class="title">{cliente.name}</div>
        <div class="subtitle">{cliente.nif}</div>
      </div>

      <div class="detail">
        Tel: {cliente.phone} |
        Dir: {cliente.address}
      </div>
    </div>

    <!-- ACTIONS -->
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
    onCancel={cerrarModal}
  >
    <ClientForm client={clienteSeleccionado} />
  </AppModal>
{/if}

<style>
  /* Avatar simple para clientes */
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #2c3e50;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .header {
    margin-bottom: 6px;
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