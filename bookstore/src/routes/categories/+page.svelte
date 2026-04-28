<script>
  import Item from '$lib/list/Item.svelte';
  import AppModal from '$lib/modal/AppModal.svelte';
  import CategoryForm from '$lib/categories/CategoryForm.svelte';
  import SearchBox from '$lib/search/SearchBox.svelte';

  let categorias = $state([
    {
      id: 1,
      name: 'Programación',
      motherCategory: 0,
      motherCategoryName: '—'
    },
    {
      id: 2,
      name: 'Frontend',
      motherCategory: 1,
      motherCategoryName: 'Programación'
    },
    {
      id: 3,
      name: 'Backend',
      motherCategory: 1,
      motherCategoryName: 'Programación'
    },
    {
      id: 4,
      name: 'Bases de Datos',
      motherCategory: 1,
      motherCategoryName: 'Programación'
    }
  ]);

  let categoriaSeleccionada = $state(null);
  let search = $state('');

  function categoriaCoincide(cat) {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      cat.name.toLowerCase().includes(q) ||
      cat.motherCategoryName.toLowerCase().includes(q)
    );
  }

  function editar(categoria) {
    categoriaSeleccionada = categoria;
  }

  function cerrar() {
    categoriaSeleccionada = null;
  }

  function guardar() {
    alert('La categoría ha sido editada');
    cerrar();
  }

  function eliminar() {
    categorias = categorias.filter(
      c => c.id !== categoriaSeleccionada.id
    );
    cerrar();
  }
</script>

<h1>Categorías</h1>

<SearchBox
  value={search}
  placeholder="Buscar por nombre de categoría..."
  onChange={(v) => search = v}
/>

{#if categorias.filter(categoriaCoincide).length === 0}
  <p>No se encontraron categorías.</p>
{/if}

{#each categorias.filter(categoriaCoincide) as categoria}
  <Item>
    <div slot="image">
      <span class="icon">📂</span>
    </div>

    <div slot="content">
      <div class="title">{categoria.name}</div>
      <div class="detail">
        Categoría madre: {categoria.motherCategoryName}
      </div>
    </div>

    <div slot="actions">
      <button type="button" onclick={() => editar(categoria)}>
        Editar
      </button>
    </div>
  </Item>
{/each}

{#if categoriaSeleccionada}
  <AppModal
    title="Editar categoría"
    onSave={guardar}
    onDelete={eliminar}
    onCancel={cerrar}
  >
    <CategoryForm category={categoriaSeleccionada} />
  </AppModal>
{/if}

<style>
  .icon {
    font-size: 20px;
  }

  .title {
    font-weight: bold;
  }

  .detail {
    font-size: 0.85em;
    color: #444;
  }

  button {
    padding: 4px 8px;
  }
</style>