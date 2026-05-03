<script>
  import { getProductById } from '$lib/api/products.api.js';

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

  function handleCancel() {
    isOpen = false;
  }

  $effect(() => {
    if (isOpen && !product) {
      loadProduct();
    }
  });
</script>

{#if isOpen}
  <div class="modal-overlay" onclick={() => (isOpen = false)}>
    <div class="modal" onclick={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h2>Agregar Producto Manual</h2>
        <button
          type="button"
          class="close-btn"
          onclick={() => (isOpen = false)}
        >
          ×
        </button>
      </div>

      <div class="modal-body">
        {#if loading}
          <p>Cargando producto...</p>
        {:else if error}
          <p style="color: red;">{error}</p>
        {:else if product}
          <div class="form-group">
            <label>Producto</label>
            <input type="text" value={product.name} disabled />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Cantidad</label>
              <input
                type="number"
                bind:value={formData.quantity}
                min="1"
                step="1"
              />
            </div>
            <div class="form-group">
              <label>Precio</label>
              <input
                type="number"
                bind:value={formData.price}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Descuento (%)</label>
              <input
                type="number"
                bind:value={formData.discount}
                min="0"
                max="100"
                step="1"
              />
            </div>
            <div class="form-group">
              <label>IVA (%)</label>
              <input
                type="number"
                bind:value={formData.iva}
                min="0"
                max="100"
                step="1"
              />
            </div>
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <button type="button" onclick={handleCancel} class="btn-secondary">
          Cancelar
        </button>
        {#if !loading && !error}
          <button type="button" onclick={handleAdd} class="btn-primary">
            Agregar
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    min-width: 320px;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.3em;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2em;
    cursor: pointer;
    color: #666;
  }

  .close-btn:hover {
    color: #000;
  }

  .modal-body {
    padding: 20px;
  }

  .form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 0.9em;
  }

  .form-group input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1em;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .modal-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 20px;
    border-top: 1px solid #eee;
  }

  .btn-primary,
  .btn-secondary {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
  }

  .btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #545b62;
  }
</style>
