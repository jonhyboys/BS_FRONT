<script>
  const { category, categories = [], onChange, errors = {} } = $props();

  let form = $state({
    name: '',
    motherCategoryId: ''
  });

  $effect(() => {
    if (!category) return;
    form.name = category.name ?? '';
    form.motherCategoryId =
      category.motherCategoryId != null
        ? String(category.motherCategoryId)
        : '';
  });

  function emitirCambios() {
    onChange({
      ...category,
      name: form.name,
      motherCategoryId:
        form.motherCategoryId !== ''
          ? Number(form.motherCategoryId)
          : null
    });
  }
</script>

<div class="body">
  <div class="form-group">
    <label for="name">Nombre</label>
    <input name="name" type="text" bind:value={form.name} oninput={emitirCambios} />
    {#if errors.name}<span class="error">{errors.name}</span>{/if}
  </div>
  <div class="form-group">
    <label for="nif">Categoría padre</label>
    <select bind:value={form.motherCategoryId} onchange={emitirCambios}>
      <option value="">— Sin categoría padre —</option>
      {#each categories as c}
        {#if !category.id || c.id !== category.id}
          <option value={String(c.id)}>{c.name}</option>
        {/if}
      {/each}
    </select>
  </div>
</div>

<style>
 .body { margin: 1em 0; }

  .form-group {
    display: flex;
    flex-direction: column;
    padding: 0.5em 0;
    width: 20em;
  }

  .form-group label { font-weight: 600; }

  .form-group input { padding: 0.5em; }
</style>