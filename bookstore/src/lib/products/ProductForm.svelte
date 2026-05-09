<script>
  import { getCategories } from '$lib/api/categories.api.js';

  const { product, onChange, errors = {} } = $props();

  let categories = $state([]);
  let loading = $state(true);

  let form = $state({
    code: '',
    name: '',
    category: '',
    cost: 0,
    price: 0,
    promotion: 0,
    quantity: 0,
    iva: 21
  });

  async function loadCategories() {
    categories = await getCategories();
    loading = false;
  }

  loadCategories();

  $effect(() => {
    if (!product || loading) return;

    form.code = product.code ?? '';
    form.name = product.name ?? '';
    form.category =
      product.category != null ? String(product.category) : '';
    form.cost = product.cost ?? 0;
    form.price = product.price ?? 0;
    form.promotion = product.promotion ?? 0;
    form.quantity = product.quantity ?? 0;
    form.iva = product.iva ?? 21;
  });

  function emitirCambios() {
    const cambios = {
      id: product?.id,
      code: form.code,
      name: form.name,
      category: form.category ? Number(form.category) : null,
      cost: Number(form.cost),
      price: Number(form.price),
      promotion: Number(form.promotion),
      quantity: Number(form.quantity),
      iva: Number(form.iva)
    };
    console.log('ProductForm emite:', cambios);
    onChange(cambios);
  }
</script>

<div class="form">
  <label>
    Código
    <input bind:value={form.code} oninput={emitirCambios} />
    {#if errors.code}<span class="error">{errors.code}</span>{/if}
  </label>

  <label>
    Nombre
    <input bind:value={form.name} oninput={emitirCambios} />
    {#if errors.name}<span class="error">{errors.name}</span>{/if}
  </label>

  <label>
    Categoría
    {#if loading}
      <p>Cargando categorías…</p>
    {:else}
      <select bind:value={form.category} onchange={emitirCambios}>
        <option value="">Seleccione una categoría</option>
        {#each categories as c}
          <option value={String(c.id)}>{c.name}</option>
        {/each}
      </select>
    {/if}
    {#if errors.category}<span class="error">{errors.category}</span>{/if}
  </label>

  <label>Costo <input type="number" bind:value={form.cost} oninput={emitirCambios} /></label>
  <label>Precio <input type="number" bind:value={form.price} oninput={emitirCambios} /></label>
  <label>Promoción (%) <input type="number" bind:value={form.promotion} oninput={emitirCambios} /></label>
  <label>Cantidad <input type="number" bind:value={form.quantity} oninput={emitirCambios} /></label>
  <label>IVA (%) <input type="number" bind:value={form.iva} oninput={emitirCambios} /></label>
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