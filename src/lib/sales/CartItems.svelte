<script>
  import IconButton from '$lib/button/IconButton.svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
  {#if items.length === 0}
    <p class="empty-message">No hay productos en el carrito</p>
  {:else}
    <div class="items-list">
      {#each items as item (item.id)}
        <div class="cart-item">
          <div class="item-details">
            <div>
              <div class="item-name">
                <span>{item.quantity}</span> - 
                <span>{item.productName}</span>
              </div>
              <div>c/u {item.price.toFixed(2)}</div>
            </div>
            <div>
              <div>Monto:</div>
              <div>{(item.quantity * item.price).toFixed(2)}</div>
            </div>
            {#if item.discount > 0}
              <div>
                <div>Descuento ({item.discount}%):</div>
                <div>-{((item.quantity * item.price) * (item.discount / 100)).toFixed(2)}</div>
              </div>
            {/if}
            <div>
              <div>Subtotal:</div>
              <div>{calculateSubtotal(item).toFixed(2)}</div>
            </div>
          </div>
          <div class="item-actions">
            <IconButton icon={faEdit} label="Editar" onclick={() => handleEdit(item)} />
            <IconButton icon={faTrash} label="Eliminar" onclick={() => handleRemove(item)} />
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .empty-message {
    font-style: italic;
    text-align: center;
  }

  .cart-item {
    align-items: center;
    border-bottom: 1px dotted #ccc;
    display: flex;
    gap: 1em;
    justify-content: space-between;
    padding: 0.5em 0;
  }

  .item-details {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .item-details > div {
    display: flex;
    justify-content: space-between;
  }

  .item-name {
    font-style: italic;
  }

  .item-actions {
    display: flex;
    flex-direction: column;
  }
</style>
