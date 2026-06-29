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
    form.category = product.category != null ? String(product.category) : '';
    form.cost = product.cost ?? 0;
    form.price = product.price ?? 0;
    form.promotion = product.promotion ?? 0;
    form.quantity = product.quantity ?? 0;
    form.iva = product.iva ?? 21;
  });

  function trigger_change() {
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
    onChange(cambios);
  }
</script>

<div class="body">
  <div class="form-group">
    <label for="name">Nombre</label>
    <input name="name" type="text" bind:value={form.name} oninput={trigger_change} />
    {#if errors.name}<span class="error">{errors.name}</span>{/if}
  </div>
  <div class="form-row">
    <div class="form-group">
      <label for="code">Código</label>
      <input name="code" type="text" bind:value={form.code} oninput={trigger_change} />
      {#if errors.code}<span class="error">{errors.code}</span>{/if}
    </div>
    <div class="form-group">
      <label for="category">Categoría</label>
      <div>
        {#if loading}
          <p>Cargando categorías…</p>
        {:else}
          <select bind:value={form.category} onchange={trigger_change} name="category">
            <option value="">Seleccione una categoría</option>
            {#each categories as c}
              <option value={String(c.id)}>{c.name}</option>
            {/each}
          </select>
        {/if}
        {#if errors.category}<span class="error">{errors.category}</span>{/if}
      </div>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label for="cost">Costo</label>
      <input name="cost" type="number" bind:value={form.cost} min="0" step="0.01" oninput={trigger_change} />
      {#if errors.cost}<span class="error">{errors.cost}</span>{/if}
    </div>
    <div class="form-group">
      <label for="price">Precio</label>
      <input name="price" type="number" bind:value={form.price} min="0" step="0.01" oninput={trigger_change} />
      {#if errors.price}<span class="error">{errors.price}</span>{/if}
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label for="quantity">Cantidad</label>
      <input name="quantity" type="number" bind:value={form.quantity} min="1" step="1" oninput={trigger_change} />
      {#if errors.quantity}<span class="error">{errors.quantity}</span>{/if}
    </div>
    <div class="form-group">
      <label for="promotion">Promoción (%)</label>
      <input name="promotion" type="number" bind:value={form.promotion} min="0" step="0.01" oninput={trigger_change} />
      {#if errors.promotion}<span class="error">{errors.promotion}</span>{/if}
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label for="iva">IVA (%)</label>
      <input name="iva" type="number" bind:value={form.iva} min="0" max="100" step="1" oninput={trigger_change} />
      {#if errors.iva}<span class="error">{errors.iva}</span>{/if}
    </div>
  </div>
</div>

<style>
  .body { margin: 1em 0; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    padding: 0.5em 0;
  }

  .form-group label { font-weight: 600; }

  .form-group input, .form-group select { padding: 0.5em; }

  .error {
    color: red;
    font-size: 0.7em;
  }
</style>