<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import ProductForm from '$lib/products/ProductForm.svelte';

  let productos = $state([
    {
      id: 1,
      name: 'Libro Svelte',
      categoryName: 'Programación',
      price: 20,
      quantity: 5,
      cost: 10
    },
    {
      id: 2,
      name: 'Libro .NET',
      categoryName: 'Backend',
      price: 25,
      quantity: 3,
      cost: 12
    }
  ]);

  let productoSeleccionado = $state(null);

  function editar(producto) {
    productoSeleccionado = producto;
  }

  function cerrarModal() {
    productoSeleccionado = null;
  }

  function guardar() {
    alert('El producto ha sido editado');
    cerrarModal();
  }

  function eliminar() {
    productos = productos.filter(
      p => p.id !== productoSeleccionado.id
    );
    cerrarModal();
  }
</script>

<h1>Productos</h1>

{#each productos as producto}
  <Item>
    <!-- IMAGE -->
    <div slot="image">
      <img
        src="/svelte-logo.svg"
        alt="Producto"
        width="40"
        height="40"
      />
    </div>

    <!-- CONTENT -->
    <div slot="content">
      <div class="header">
        <div class="title">{producto.name}</div>
        <div class="subtitle">{producto.categoryName}</div>
      </div>

      <div class="detail">
        Precio ${producto.price} |
        Cantidad {producto.quantity} |
        Costo ${producto.cost}
      </div>
    </div>

    <!-- ACTIONS -->
    <div slot="actions">
      <button type="button" onclick={() => editar(producto)}>
        Editar
      </button>
      <button type="button" disabled>
        Vender
      </button>
    </div>
  </Item>
{/each}

{#if productoSeleccionado}
  <AppModal
    title="Editar producto"
    onSave={guardar}
    onDelete={eliminar}
    onCancel={cerrarModal}
  >
    <ProductForm product={productoSeleccionado} />
  </AppModal>
{/if}

<style>
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