<script>
  let { items = [], onEdit, onRemove } = $props();

  function calculateSubtotal(item) {
    const baseAmount = item.quantity * item.price;
    const discountAmount = baseAmount * (item.discount / 100);
    return baseAmount - discountAmount;
  }

  function handleEdit(item) {
    if (onEdit) onEdit(item);
  }

  function handleRemove(item) {
    if (confirm(`¿Deseas eliminar "${item.productName}"?`)) {
      if (onRemove) onRemove(item.id);
    }
  }
</script>

<div class="cart-items">
  <h3>Productos</h3>

  {#if items.length === 0}
    <p class="empty-message">No hay productos en el carrito</p>
  {:else}
    <div class="items-list">
      {#each items as item (item.id)}
        <div class="cart-item">
          <div class="item-info">
            <div class="product-name">{item.productName}</div>
            <div class="item-details">
              <span>Cant: {item.quantity}</span>
              <span>Precio: ${item.price.toFixed(2)}</span>
              <span>Desc: {item.discount}%</span>
              <span>SubTotal: ${calculateSubtotal(item).toFixed(2)}</span>
            </div>
          </div>
          <div class="item-actions">
            <button
              type="button"
              onclick={() => handleEdit(item)}
              class="btn-edit"
              title="Editar"
            >
              Editar
            </button>
            <button
              type="button"
              onclick={() => handleRemove(item)}
              class="btn-delete"
              title="Eliminar"
            >
              Eliminar
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .cart-items {
    padding: 15px;
    background: #f9f9f9;
    border-radius: 4px;
    max-height: 400px;
    overflow-y: auto;
  }

  .cart-items h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.1em;
  }

  .empty-message {
    text-align: center;
    color: #999;
    padding: 20px 0;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .item-info {
    flex: 1;
  }

  .product-name {
    font-weight: 600;
    margin-bottom: 5px;
  }

  .item-details {
    display: flex;
    gap: 15px;
    font-size: 0.85em;
    color: #666;
    flex-wrap: wrap;
  }

  .item-actions {
    display: flex;
    gap: 8px;
    margin-left: 10px;
  }

  .btn-edit,
  .btn-delete {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85em;
  }

  .btn-edit {
    background-color: #17a2b8;
    color: white;
  }

  .btn-edit:hover {
    background-color: #138496;
  }

  .btn-delete {
    background-color: #dc3545;
    color: white;
  }

  .btn-delete:hover {
    background-color: #c82333;
  }
</style>
