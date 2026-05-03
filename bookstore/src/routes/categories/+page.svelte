<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import CategoryForm from '$lib/categories/CategoryForm.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';

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
  <button onclick={nuevo}>Nueva categoría</button>
</div>

<!-- ✅ BUSCADOR RESTAURADO -->
<SearchBox
  value={search}
  placeholder="Buscar categoría..."
  onChange={handleSearch}
/>

{#if loading}
  <p>Cargando categorías…</p>
{/if}

{#if error}
  <p class="error">{error}</p>
{/if}

{#each categorias as categoria}
  <Item>
    <div slot="image">📂</div>

    <div slot="content">
      <div class="title">{categoria.name}</div>
      <div class="detail">
        Categoría padre: {categoria.motherCategoryName ?? '—'}
      </div>
    </div>

    <div slot="actions">
      <button onclick={() => editar(categoria)}>Editar</button>
      <button onclick={() => eliminar(categoria)}>Eliminar</button>
    </div>
  </Item>
{/each}

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
  .page-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .title {
    font-weight: bold;
  }

  .detail {
    font-size: 0.85em;
    color: #444;
  }

  .error {
    color: red;
  }
</style>