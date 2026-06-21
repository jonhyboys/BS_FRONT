<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import ProductForm from '$lib/products/ProductForm.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';  
  import IconButton from '$lib/button/IconButton.svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faEdit, faTrash, faCoins, faTag, faBoxesStacked, faGift } from '@fortawesome/free-solid-svg-icons';
  import PageTitle from '$lib/page/PageTitle.svelte';
  import Pagination from '$lib/pagination/Pagination.svelte';
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
  let isOpen = $state(false);  
  let page = $state(1);
  let pageSize = $state(10);
  let total = $state(0);

  $effect(() => {
    loadProducts();
  });

  async function loadProducts() {
    loading = true;
    error = null;
    try {
      const data = await getProducts(page, pageSize);
      productos = data.items.map(p => ({
        ...p,
        category: p.categoryId
      }));
      total = data.total;
    } finally { loading = false; }
  }

  function handleSearch(value) {
    search = value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      const cleaned = value.trim().replace(/[^a-zA-Z0-9]/g, '');
      if (cleaned.length === 0) {
        loadProducts();
        return;
      }
      if (cleaned.length < 3) { return; }
      loading = true;
      try {
        const data = await searchProducts(value, page, pageSize);
        productos = data.items.map(p => ({
          ...p,
          category: p.categoryId
        }));
        total = data.total;
      } finally { loading = false; }
    }, 200);
  }

  function handle_new_product() {
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
    isOpen = true;
  }

  function handle_edit_product(producto) {
    errores = {};
    productoSeleccionado = {
      id: producto.id,
      code: producto.code,
      name: producto.name,
      category: producto.category ?? producto.categoryId,
      cost: producto.cost,
      price: producto.price,
      promotion: producto.promotion,
      quantity: producto.quantity,
      iva: producto.iva
    };
     isOpen = true;
  }

  async function handle_save_product() {
    const e = validate_product(productoSeleccionado);
    errores = e;
    if (Object.keys(e).length > 0) return;
    const productoParaEnviar = {
      id: productoSeleccionado.id,
      code: productoSeleccionado.code,
      name: productoSeleccionado.name,
      category: Number(productoSeleccionado.category),
      cost: Number(productoSeleccionado.cost) ?? 0,
      price: Number(productoSeleccionado.price) ?? 0,
      promotion: Number(productoSeleccionado.promotion) ?? 0,
      quantity: Number(productoSeleccionado.quantity) ?? 0,
      iva: Number(productoSeleccionado.iva) ?? 0
    };
    if (productoSeleccionado.id) { await updateProduct(productoParaEnviar); }
    else { await createProduct(productoParaEnviar);}
    handle_close_modal();
    loadProducts();
  }

  async function handle_delete_product(producto) {
    if (!confirm('¿Realmente desea eliminar este producto?')) { return; }
    await deleteProduct(producto.id);
    loadProducts();
  }

  function handle_close_modal() {
    productoSeleccionado = null;
    errores = {};
    isOpen = false;
  }

  function validate_product(p) {
    const e = {};
    if (!p.code?.trim()) { e.code = 'El código es obligatorio'; }
    if (!p.name?.trim()) { e.name = 'El nombre es obligatorio'; }
    if (!p.category) { e.category = 'Debe seleccionar una categoría'; }
    return e;
  }

  function handlePageChange(e) {
    const { page: newPage, pageSize: newPageSize } = e.detail;
    page = newPage;
    pageSize = newPageSize;
    loadProducts();
  }
</script>

<PageTitle title="Productos" buttonLabel="Nuevo producto" buttonOnClick={handle_new_product}>
  {#snippet children()}
    <SearchBox
      value={search}
      placeholder="Buscar por nombre o código..."
      onChange={handleSearch}
    />
  {/snippet}
</PageTitle>


<Pagination
  {page}
  {pageSize}
  {total}
  on:change={handlePageChange}
/>

{#if loading}<p>Cargando productos…</p>{/if}
{#if error}<p class="error">{error}</p>{/if}
<div class="item-container">
  {#each productos as producto}
    <Item>
      <FontAwesomeIcon slot="image" icon={faGift} />
      <div slot="content">
        <div class="title">{producto.name}</div>        
        <div class="subtitle">{producto.code} | {producto.categoryName}</div>
        <div class="detail">
          <span><FontAwesomeIcon icon={faCoins} /> {producto.price}</span>
          <span><FontAwesomeIcon icon={faTag} /> {producto.cost}</span>
          <span><FontAwesomeIcon icon={faBoxesStacked} /> {producto.quantity}</span>
        </div>
      </div>
      <div slot="actions" class="button-container">
        <IconButton size="2x" icon={faEdit} label="Editar" onclick={() => handle_edit_product(producto)} />
        <IconButton size="2x" icon={faTrash} label="Eliminar" onclick={() => handle_delete_product(producto)} />
      </div>
    </Item>
  {/each}
</div>
{#if productoSeleccionado}
  <AppModal
    title={productoSeleccionado.id ? 'Editar producto' : 'Nuevo producto'}
    onSave={handle_save_product}
    onCancel={handle_close_modal}
    bind:isOpen={isOpen}
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
  .item-container {    
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(25em, 1fr));
  }
  
  .title {
    font-size: 1em;
    font-weight: bold;
    margin-bottom: .5em;
  }
  .subtitle { 
      color: #888;
      margin-bottom: .5em;
  }
  
  .detail { color: #444; }

  .detail > span { margin-right: 1em; }

  .button-container {
    display: flex;
    flex-direction: column;
    gap: .5em;
  }
</style>