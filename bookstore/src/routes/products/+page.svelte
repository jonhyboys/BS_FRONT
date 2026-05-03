<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import ProductForm from '$lib/products/ProductForm.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';

  import {
    getProducts,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } from '$lib/api/products.api.js';

  let productos = $state([]);
  let productoSeleccionado = $state(null);
  let errores = $state({});

  let search = $state('');
  let loading = $state(false);
  let error = $state(null);
  let searchTimeout;

  // =======================
  // LOAD PRODUCTS
  // =======================
  async function loadProducts() {
    loading = true;
    error = null;

    try {
      const data = await getProducts(1);
      productos = data.map(p => ({
        ...p,
        category: p.categoryId
      }));
    } finally {
      loading = false;
    }
  }

  loadProducts();

  // =======================
  // SEARCH
  // =======================
  function handleSearch(value) {
    search = value;
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
      const cleaned = value.trim().replace(/[^a-zA-Z0-9]/g, '');

      if (cleaned.length === 0) {
        loadProducts();
        return;
      }

      if (cleaned.length < 3) return;

      loading = true;
      try {
        const data = await searchProducts(value, 1);
        productos = data.map(p => ({
          ...p,
          category: p.categoryId
        }));
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
    productoSeleccionado = {
      code: '',
      name: '',
      category: null,
      cost: 0,
      price: 0,
      promotion: 0,
      quantity: 0,
      iva: 21
    };
  }

  function editar(producto) {
    errores = {};
    productoSeleccionado = { ...producto };
  }

  function cerrarModal() {
    productoSeleccionado = null;
    errores = {};
  }

  function validar(p) {
    const e = {};
    if (!p.code?.trim()) e.code = 'El código es obligatorio';
    if (!p.name?.trim()) e.name = 'El nombre es obligatorio';
    if (!p.category) e.category = 'Debe seleccionar una categoría';
    return e;
  }

  async function guardar() {
    const e = validar(productoSeleccionado);
    errores = e;
    if (Object.keys(e).length > 0) return;

    if (productoSeleccionado.id) {
      await updateProduct(productoSeleccionado);
    } else {
      await createProduct(productoSeleccionado);
    }

    cerrarModal();
    loadProducts();
  }

  async function eliminar(producto) {
    if (!confirm('¿Eliminar este producto?')) return;
    await deleteProduct(producto.id);
    loadProducts();
  }
</script>

<div class="page-header">
  <h1>Productos</h1>
  <button onclick={nuevo}>Nuevo producto</button>
</div>

<SearchBox
  value={search}
  placeholder="Buscar por nombre o código..."
  onChange={handleSearch}
/>

{#if loading}
  <p>Cargando productos…</p>
{/if}

{#if error}
  <p class="error">{error}</p>
{/if}

{#each productos as producto}
  <Item>
    <div slot="image">/svelte-logo.svg</div>

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
      <button onclick={() => editar(producto)}>Editar</button>
      <button onclick={() => eliminar(producto)}>Eliminar</button>
    </div>
  </Item>
{/each}

{#if productoSeleccionado}
  <AppModal
    title={productoSeleccionado.id ? 'Editar producto' : 'Nuevo producto'}
    onSave={guardar}
    onCancel={cerrarModal}
    actionsAlign="right"
  >
    <ProductForm
      key={productoSeleccionado.id ?? 'new'}
      product={productoSeleccionado}
      errors={errores}
      onChange={(p) => (productoSeleccionado = p)}
    />
  </AppModal>
{/if}

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
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
  .error {
    color: red;
  }
</style>