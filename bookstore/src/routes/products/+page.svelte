<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import ProductForm from '$lib/products/ProductForm.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';

  let productos = $state([
    {
      id: 1,
      code: 'P001',
      name: 'Libro Svelte',
      categoryName: 'Programación',
      price: 20,
      quantity: 5,
      cost: 10
    },
    {
      id: 2,
      code: 'P002',
      name: 'Libro .NET',
      categoryName: 'Backend',
      price: 25,
      quantity: 3,
      cost: 12
    },
    {
      id: 3,
      code: 'P003',
      name: 'JavaScript Moderno',
      categoryName: 'Frontend',
      price: 18,
      quantity: 8,
      cost: 9
    },
    {
      id: 4,
      code: 'BK-REACT',
      name: 'Aprendiendo React',
      categoryName: 'Frontend',
      price: 22,
      quantity: 4,
      cost: 11
    },
    {
      id: 5,
      code: 'ALG-001',
      name: 'Algoritmos y Estructuras de Datos',
      categoryName: 'Ciencias de la Computación',
      price: 30,
      quantity: 2,
      cost: 15
    }
  ]);

  let productoSeleccionado = $state(null);
  let search = $state('');

  function productoCoincide(producto) {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      producto.name.toLowerCase().includes(q) ||
      producto.code.toLowerCase().includes(q)
    );
  }

  function editar(producto) {
    productoSeleccionado = producto;
  }

  function cerrar() {
    productoSeleccionado = null;
  }

  function guardar() {
    alert('El producto ha sido editado');
    cerrar();
  }

  function eliminar() {
    productos = productos.filter(
      p => p.id !== productoSeleccionado.id
    );
    cerrar();
  }
</script>

<h1>Productos</h1>

<SearchBox
  value={search}
  placeholder="Buscar por nombre o código..."
  onChange={(v) => search = v}
/>

{#if productos.filter(productoCoincide).length === 0}
  <p>No se encontraron productos.</p>
{/if}

{#each productos.filter(productoCoincide) as producto}
  <Item>
    <div slot="image">
      <img src="/svelte-logo.svg" alt="Producto" width="40" />
    </div>

    <div slot="content">
      <div class="title">{producto.name}</div>
      <div class="subtitle">
        Código: {producto.code} · {producto.categoryName}
      </div>
      <div class="detail">
        Precio ${producto.price} |
        Cantidad {producto.quantity} |
        Costo ${producto.cost}
      </div>
    </div>

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
    onCancel={cerrar}
  >
    <ProductForm product={productoSeleccionado} />
  </AppModal>
{/if}

<style>
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