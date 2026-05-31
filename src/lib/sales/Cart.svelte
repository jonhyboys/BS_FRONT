<script>
  import CartItems from './CartItems.svelte';
  import CartSummary from './CartSummary.svelte';
  import ProductManualModal from './ProductManualModal.svelte';
  import CartItemEditModal from './CartItemEditModal.svelte';
  import { cart } from '$lib/stores/cartStore.js';
  import { getProductById } from '$lib/api/products.api.js';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faBagShopping, faMarker, faRectangleXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/button/IconButton.svelte';

  let { onsaleComplete } = $props();
  let cartItems = $state([]);
  let editingItem = $state(null);
  let isManualModalOpen = $state(false);
  let isEditModalOpen = $state(false);

  $effect(() => {
    const unsubscribe = cart.subscribe(items => {
      cartItems = items;
    });
    return unsubscribe;
  });

  async function handleAddBolsa() {
    try {
      const bolsa = await getProductById(1);
      cart.addItem({
        productId: 1,
        productName: bolsa.name,
        quantity: 1,
        price: bolsa.price,
        discount: 0,
        iva: bolsa.iva ?? 0
      });
    } catch (err) {
      alert(err.message);
    }
  }

  function handleAddProduct(item) {
    cart.addItem(item);
  }

  function handleEditItem(item) {
    editingItem = item;
    isEditModalOpen = true;
  }

  function handleSaveEdit(updates) {
    cart.updateItem(editingItem.id, updates);
    editingItem = null;
  }

  function handleRemoveItem(id) {
    cart.removeItem(id);
  }

  function handleCancelSale() {
    if (cartItems.length && confirm('¿Deseas cancelar la venta?')) {
      cart.clear();
    }
  }
</script>

<div class="cart-container">
  <div class="cart-header">
    <div class="cart-title">
        <h2>Carrito</h2>
    </div>
    <div>
      <IconButton size="2x" icon={faBagShopping} label="Bolsa" onclick={handleAddBolsa} />
      <IconButton size="2x" icon={faMarker} label="Manual" onclick={() => (isManualModalOpen = true)} />
    </div>
  </div>
  <CartItems
    items={cartItems}
    onEdit={handleEditItem}
    onRemove={handleRemoveItem}
  />
  <CartSummary items={cartItems} />
  <div class="cart-actions">
    <IconButton size="2x" icon={faRectangleXmark} label="Cancelar" onclick={handleCancelSale} />
    <IconButton size="2x" icon={faFloppyDisk} label="Guardar" onclick={onsaleComplete} />
  </div>
</div>
<ProductManualModal
  bind:isOpen={isManualModalOpen}
  onAdd={handleAddProduct}
/>
<CartItemEditModal
  bind:isOpen={isEditModalOpen}
  bind:item={editingItem}
  onSave={handleSaveEdit}
/>

<style>
    .cart-container {
        flex: 1;
        margin: 0 1em;
    }

  .cart-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
  }

  .cart-actions {
    display: flex;
    gap: 1em;
    justify-content: flex-end;
    margin-top: 1em;
  }
</style>
