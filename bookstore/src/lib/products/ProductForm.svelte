<script>
  // Props (runes mode)
  const { product } = $props();

  // Estado local editable del formulario
  let form = $state({});

  // Sincronizar el formulario cada vez que cambia el producto
  $effect(() => {
    form = { ...product };
  });
</script>

<label>
  Id
  <input type="text" value={form.id} readonly />
</label>

<label>
  Código
  <input type="text" bind:value={form.code} />
</label>

<label>
  Nombre
  <input type="text" bind:value={form.name} />
</label>

<label>
  Categoría
  <select bind:value={form.categoryName}>
    <option value={form.categoryName}>
      {form.categoryName}
    </option>
    <option value="Test">Test</option>
  </select>
</label>

<label>
  Costo
  <input type="number" bind:value={form.cost} />
</label>

<label>
  Precio
  <input type="number" bind:value={form.price} />
</label>

<label>
  Promoción (%)
  <input type="number" bind:value={form.promotion} />
</label>

<label>
  Cantidad
  <input type="number" bind:value={form.quantity} />
</label>

<label>
  IVA (%)
  <input type="number" bind:value={form.iva} />
</label>

<style>
  label {
    display: block;
    margin-bottom: 8px;
  }

  input,
  select {
    width: 100%;
    box-sizing: border-box;
  }
</style>