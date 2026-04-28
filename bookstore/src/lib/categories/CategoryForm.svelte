<script>
  const { category } = $props();

  let form = $state({});

  // Sincronizamos cada vez que cambia la categoría
  $effect(() => {
    form = { ...category };
  });
</script>

<label>
  Id
  <input type="text" value={form.id} readonly />
</label>

<label>
  Nombre
  <input type="text" bind:value={form.name} />
</label>

<label>
  Categoría madre
  <input type="text" bind:value={form.motherCategoryName} />
</label>

<style>
  label {
    display: block;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    box-sizing: border-box;
  }
</style>