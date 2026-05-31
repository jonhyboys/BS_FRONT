<script>
  import { getProductById } from '$lib/api/products.api.js';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faRectangleXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/button/IconButton.svelte';

  let { isOpen = $bindable(false), onAdd } = $props();
  let product = $state(null);
  let loading = $state(true);
  let error = $state(null);
  let formData = $state({
    quantity: 1,
    price: 0,
    discount: 0,
    iva: 0
  });

  async function loadProduct() {
    try {
      loading = true;
      error = null;
      product = await getProductById(2);
      formData = {
        quantity: 1,
        price: product.price || 0,
        discount: 0,
        iva: product.iva || 0
      };
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleAdd() {
    if (onAdd) {
      onAdd({
        productId: 2,
        productName: product.name,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        discount: parseInt(formData.discount),
        iva: parseInt(formData.iva)
      });
    }
    isOpen = false;
  }

  function handleCancel() { isOpen = false;}

  $effect(() => {
    if (isOpen && !product) { loadProduct();}
  });
</script>

{#if isOpen}
  <div class="modal-overlay">
    <div class="modal">
      <h2>Agregar producto a mano</h2>
      <div class="body">
        {#if loading}
          <p>Cargando producto...</p>
        {:else if error}
          <p>{error}</p>
        {:else if product}
          <div class="form-group">
            <label for="productName">Producto</label>
            <input name="productName" type="text" value={product.name} disabled />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="quantity">Cantidad</label>
              <input name="quantity" type="number" bind:value={formData.quantity} min="1" step="1" />
            </div>
            <div class="form-group">
              <label for="price">Precio</label>
              <input name="price" type="number" bind:value={formData.price} min="0" step="0.01" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="discount">Descuento (%)</label>
              <input name="discount" type="number" bind:value={formData.discount} min="0" max="100" step="1" />
            </div>
            <div class="form-group">
              <label for="iva">IVA (%)</label>
              <input name="iva" type="number" bind:value={formData.iva} min="0" max="100" step="1" />
            </div>
          </div>
        {/if}
      </div>
      <div class="actions">
        <IconButton size="2x" icon={faRectangleXmark} label="Cancelar" onclick={handleCancel} />
        {#if !loading && !error}
          <IconButton size="2x" icon={faFloppyDisk} label="Agregar" onclick={handleAdd} />
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    align-items: center;
    background: #0003;
    display: flex;
    inset: 0;
    justify-content: center;
    position: fixed;
    z-index: 10;
  }

  .modal {
    background: #FFF;
    box-shadow: 0 4px 16px #000;
    display: flex;
    flex-direction: column;
    max-width: 50%;
    padding: 1em;
  }

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

  .form-group input { padding: 0.5em; }

  .actions {
    display: flex;
    gap: 1em;
    justify-content: space-between;
    margin-top: 1em;
  }
</style>
