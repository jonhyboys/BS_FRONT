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

<div class="form">
  <label>
    Nombre
    <input bind:value={form.name} oninput={emitirCambios} />
    {#if errors.name}
      <span class="error">{errors.name}</span>
    {/if}
  </label>

  <label>
    Categoría padre
    <select bind:value={form.motherCategoryId} onchange={emitirCambios}>
      <option value="">— Sin categoría padre —</option>
      {#each categories as c}
        {#if !category.id || c.id !== category.id}
          <option value={String(c.id)}>{c.name}</option>
        {/if}
      {/each}
    </select>
  </label>
</div>

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .error {
    color: red;
    font-size: 0.8em;
  }
</style>