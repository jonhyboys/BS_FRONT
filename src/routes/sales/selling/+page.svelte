<script>
  import { onMount } from 'svelte';
  import SearchProducts from '$lib/sales/SearchProducts.svelte';
  import Cart from '$lib/sales/Cart.svelte';
  import SalesList from '$lib/sales/SalesList.svelte';
  import { getPendingSales, createSale } from '$lib/api/sales.api.js';
  import { createClousure } from '$lib/api/clousures.api.js';
  import { getProductById, updateProduct } from '$lib/api/products.api.js';
  import { cart } from '$lib/stores/cartStore.js';
  import PageTitle from '$lib/page/PageTitle.svelte';
  import { faCashRegister } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/button/IconButton.svelte';

  let sales = $state([]);
  let salesLoading = $state(true);
  let salesError = $state(null);

  async function loadSales() {
    try {
      salesLoading = true;
      salesError = null;
      sales = await getPendingSales();
    } catch (err) {
      salesError = err.message;
    } finally {
      salesLoading = false;
    }
  }

  onMount(loadSales);

  async function handleCloseDay() {
    if (sales.length === 0) return;

    if (!confirm('¿Deseas cerrar el día? Se incluirán todas las ventas pendientes.')) {
      return;
    }

    try {
      const ids = sales.map(s => s.id);
      await createClousure(ids);
      sales = [];
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSaleComplete() {
    const cartItems = cart.getCartData();
    
    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      const items = cartItems.map(i => ({
        product: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        discount: i.discount,
        iva: i.iva,
        price: i.price
      }));

      await createSale({ items });

      // Actualizar inventario de cada producto
      for (const item of cartItems) {
        try {
          const product = await getProductById(item.productId);
          const updatedProduct = {
            ...product,
            quantity: product.quantity - item.quantity
          };
          await updateProduct(updatedProduct);
        } catch (err) {
          console.error(`Error al actualizar inventario del producto ${item.productId}:`, err);
        }
      }

      cart.clear();
      await loadSales();
    } catch (err) {
      alert(err.message);
    }
  }
</script>

<PageTitle title="Ventas">
  {#snippet children()}
    <SearchProducts />
  {/snippet}
</PageTitle>

<div class="container">
  <Cart onsaleComplete={handleSaleComplete} />
  <div class="sales-wrapper">
    <div class="sales-header">
      <h2>Ventas pendientes de cierre</h2>
      <IconButton size="2x" icon={faCashRegister} label="Cerrar día" onclick={handleCloseDay} disabled={sales.length === 0} />
    </div>
    <SalesList 
      sales={sales} 
      isLoading={salesLoading} 
      error={salesError}
    />
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
  }

  .sales-wrapper {
    flex: 1;
    margin: 0 1em;
  }

  .sales-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5em;
  }

  .sales-header h2 {
    margin: 0;
  }
</style>
