<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import CategoryForm from '$lib/categories/CategoryForm.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';
  import IconButton from '$lib/button/IconButton.svelte';
  import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

  import {
    getCategories,
    searchCategoriesByName,
    createCategory,
    updateCategory,
    deleteCategory
  } from '$lib/api/categories.api.js';

  let categorias = $state([]);
  let categoriaSeleccionada = $state(null);
  let errores = $state({});

  let search = $state('');
  let loading = $state(false);
  let error = $state(null);
  let searchTimeout;

  // =======================
  // LOAD
  // =======================
  async function loadCategories() {
    loading = true;
    error = null;
    try {
      categorias = await getCategories();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  loadCategories();

  // =======================
  // SEARCH (igual que Productos / Clientes)
  // =======================
  function handleSearch(value) {
    search = value;
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
      const cleaned = value.trim();

      if (cleaned.length === 0) {
        loadCategories();
        return;
      }

      if (cleaned.length < 3) return;

      loading = true;
      error = null;

      try {
        categorias = await searchCategoriesByName(value);
      } catch (e) {
        error = e.message;
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
    categoriaSeleccionada = {
      name: '',
      motherCategoryId: null
    };
  }

  function editar(categoria) {
    errores = {};
    categoriaSeleccionada = { ...categoria };
  }

  function cerrarModal() {
    categoriaSeleccionada = null;
    errores = {};
  }

  function validarCategoria(c) {
    const e = {};
    if (!c.name || c.name.trim() === '') {
      e.name = 'El nombre de la categoría es obligatorio';
    }
    return e;
  }

  async function guardar() {
    const e = validarCategoria(categoriaSeleccionada);
    errores = e;

    if (Object.keys(e).length > 0) return;

    if (categoriaSeleccionada.id) {
      await updateCategory(categoriaSeleccionada);
    } else {
      await createCategory(categoriaSeleccionada);
    }

    cerrarModal();
    loadCategories();
  }

  async function eliminar(categoria) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    await deleteCategory(categoria.id);
    loadCategories();
  }
</script>

<!-- HEADER -->
<div class="page-header">
  <h1>Categorías</h1>
  <button onclick={nuevo} class="blue">Nueva categoría</button>
</div>

<div class="search-box">
  <SearchBox
    value={search}
    placeholder="Buscar categoría..."
    onChange={handleSearch}
  />
</div>

{#if loading}
  <p>Cargando categorías…</p>
{/if}

{#if error}
  <p class="error">{error}</p>
{/if}

<div class="item-container">
  {#each categorias as categoria}
    <Item>
      <div slot="image">📂</div>
      <div slot="content">
        <div class="title">{categoria.name}</div>
        <div class="detail">
          Categoría padre: {categoria.motherCategoryName ?? '—'}
        </div>
      </div>
      <div slot="actions" class="button-container">
        <IconButton icon={faEdit} label="Editar" onclick={() => editar(categoria)} variant="primary" />
        <IconButton icon={faTrash} label="Eliminar" onclick={() => eliminar(categoria)} variant="danger" />
      </div>
    </Item>
  {/each}
</div>

{#if categoriaSeleccionada}
  <AppModal
    title={categoriaSeleccionada.id ? 'Editar categoría' : 'Nueva categoría'}
    onSave={guardar}
    onCancel={cerrarModal}
    actionsAlign="right"
  >
    <CategoryForm
      key={categoriaSeleccionada.id ?? 'new'}
      category={categoriaSeleccionada}
      categories={categorias}
      errors={errores}
      onChange={(c) => (categoriaSeleccionada = c)}
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
  .page-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .title { 
    font-weight: bold;
    margin-bottom: 1em;
  }

  .detail {
    font-size: 0.85em;
    color: #444;
  }

  .error { color: red; }

  .button-container {
    display: flex;
    flex-direction: column;
    gap: .5em;
  }
</style>