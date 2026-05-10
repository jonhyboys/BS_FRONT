<script>
  import { onMount } from 'svelte';
  import SaleRow from '$lib/sales/SaleRow.svelte';
  import SearchProducts from '$lib/sales/SearchProducts.svelte';
  import CartItems from '$lib/sales/CartItems.svelte';
  import CartSummary from '$lib/sales/CartSummary.svelte';
  import ProductManualModal from '$lib/sales/ProductManualModal.svelte';
  import CartItemEditModal from '$lib/sales/CartItemEditModal.svelte';
  import TicketModal from '$lib/sales/TicketModal.svelte';
  import InvoiceGenerator from '$lib/sales/InvoiceGenerator.svelte';
  import InvoiceClientModal from '$lib/invoices/InvoiceClientModal.svelte';
  import { getPendingSales, createSale } from '$lib/api/sales.api.js';
  import { createClousure } from '$lib/api/clousures.api.js';
  import { createInvoice, getInvoiceBySaleId } from '$lib/api/invoices.api.js';
  import { getProductById, updateProduct } from '$lib/api/products.api.js';
  import { cart } from '$lib/stores/cartStore.js';

  // =======================
  // STATE
  // =======================

  let sales = $state([]);
  let salesLoading = $state(true);
  let salesError = $state(null);

  let cartItems = $state([]);
  let editingItem = $state(null);

  let isManualModalOpen = $state(false);
  let isEditModalOpen = $state(false);
  let isTicketModalOpen = $state(false);

  let isInvoiceModalOpen = $state(false);
  let invoiceSalePending = $state(null);
  let invoiceSale = $state(null);

  let selectedSale = $state(null);

  // =======================
  // CART SUBSCRIPTION
  // =======================

  $effect(() => {
    const unsubscribe = cart.subscribe(items => {
      cartItems = items;
    });
    return unsubscribe;
  });

  // =======================
  // LOAD SALES (SIN CIERRE)
  // =======================

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

  // =======================
  // CIERRE DE DÍA
  // =======================

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

  // =======================
  // CARRITO
  // =======================

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

  async function handleSaleComplete() {
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

  function handleCancelSale() {
    if (cartItems.length && confirm('¿Deseas cancelar la venta?')) {
      cart.clear();
    }
  }

  // =======================
  // TICKET / FACTURA
  // =======================

  function handleTicketClick(sale) {
    selectedSale = sale;
    isTicketModalOpen = true;
  }

  async function handleInvoiceClick(sale) {
    try {
      // Verificar si ya existe una factura para esta venta
      const existingInvoice = await getInvoiceBySaleId(sale.id);
      
      if (existingInvoice) {
        // Si existe factura, generar PDF directamente
        invoiceSale = {
          ...sale,
          client: existingInvoice.client
        };
      } else {
        // Si no existe, abrir modal para seleccionar cliente
        invoiceSalePending = sale;
        isInvoiceModalOpen = true;
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleInvoiceClientSelected(client) {
    try {
      await createInvoice({
        client: client.id,
        sales: [invoiceSalePending.id]
      });

      // Pasamos la venta (con cliente) al generador
      invoiceSale = {
        ...invoiceSalePending,
        client
      };
    } catch (err) {
      alert(err.message);
    } finally {
      isInvoiceModalOpen = false;
      invoiceSalePending = null;
    }
  }

  function cancelInvoice() {
    isInvoiceModalOpen = false;
    invoiceSalePending = null;
  }
</script>

<div class="page-container">
  <h1>Vender</h1>
  <SearchProducts onAddProduct={handleAddProduct} />

  <div class="main-content">
    <!-- CARRITO -->
    <div class="cart-section">
      <div class="quick-buttons">
        <button class="btn-bolsa" onclick={handleAddBolsa}>Bolsa</button>
        <button class="btn-manual" onclick={() => (isManualModalOpen = true)}>
          Manual
        </button>
      </div>

      <CartItems
        items={cartItems}
        onEdit={handleEditItem}
        onRemove={handleRemoveItem}
      />

      <CartSummary items={cartItems} />

      <div class="cart-actions">
        <button class="btn-cancel" onclick={handleCancelSale}>
          Cancelar
        </button>
        <button class="btn-save" onclick={handleSaleComplete}>
          Guardar
        </button>
      </div>
    </div>

    <!-- VENTAS -->
    <div class="sales-section">
      <h2>
        Ventas pendientes de cierre
        <button
          class="btn-close-day"
          disabled={sales.length === 0}
          onclick={handleCloseDay}
        >
          Cerrar día
        </button>
      </h2>

      {#if !salesLoading && !salesError && sales.length > 0}
        <div class="sales-summary">
          <p><strong>Total de ventas:</strong> {sales.length}</p>
          <p><strong>Monto total:</strong> ${sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}</p>
        </div>
      {/if}

      {#if salesLoading}
        <p>Cargando...</p>
      {:else if salesError}
        <p style="color:red">{salesError}</p>
      {:else if sales.length === 0}
        <div class="blank-state">
          <p>No hay ventas pendientes.</p>
        </div>
      {:else}
        <div class="sales-list">
          {#each sales as sale}
            <SaleRow
              sale={sale}
              onTicket={handleTicketClick}
              onInvoice={handleInvoiceClick}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- MODALES -->
  <ProductManualModal
    bind:isOpen={isManualModalOpen}
    onAdd={handleAddProduct}
  />

  <CartItemEditModal
    bind:isOpen={isEditModalOpen}
    bind:item={editingItem}
    onSave={handleSaveEdit}
  />

  <TicketModal
    bind:isOpen={isTicketModalOpen}
    bind:sale={selectedSale}
  />

  <InvoiceClientModal
    isOpen={isInvoiceModalOpen}
    onSelect={handleInvoiceClientSelected}
    onCancel={cancelInvoice}
  />

  {#if invoiceSale}
    <InvoiceGenerator bind:sale={invoiceSale} />
  {/if}
</div>

<style>
  .page-container {
    padding: 20px;
  }

  .page-container h1 {
    margin-bottom: 20px;
  }

  .main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }

  .cart-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .quick-buttons {
    display: flex;
    gap: 10px;
  }

  .btn-bolsa,
  .btn-manual {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
  }

  .btn-bolsa {
    background-color: #6c757d;
    color: white;
  }

  .btn-bolsa:hover {
    background-color: #5a6268;
  }

  .btn-manual {
    background-color: #17a2b8;
    color: white;
  }

  .btn-manual:hover {
    background-color: #138496;
  }

  .cart-actions {
    display: flex;
    gap: 10px;
  }

  .btn-cancel,
  .btn-save {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
  }

  .btn-cancel {
    background-color: #dc3545;
    color: white;
  }

  .btn-cancel:hover {
    background-color: #c82333;
  }

  .btn-save {
    background-color: #28a745;
    color: white;
  }

  .btn-save:hover {
    background-color: #218838;
  }

  .sales-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .sales-section h2 {
    margin: 0;
    font-size: 1.2em;
  }

  .sales-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 600px;
    overflow-y: auto;
  }

  .blank-state {
    text-align: center;
    padding: 40px 20px;
    color: #999;
    font-size: 1.1em;
    background: #f9f9f9;
    border-radius: 4px;
  }

  @media (max-width: 1024px) {
    .main-content {
      grid-template-columns: 1fr;
    }
  }

  .btn-close-day {
    float: right;
    margin-top: -2px;
    padding: 4px 10px;
    font-size: 0.85em;
    font-weight: 600;
    background: #ffc107;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-close-day:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sales-summary {
    display: flex;
    gap: 30px;
    padding: 12px;
    background-color: #f0f8ff;
    border-left: 4px solid #007bff;
    border-radius: 4px;
  }

  .sales-summary p {
    margin: 0;
    font-size: 0.95em;
    color: #333;
  }

  .sales-summary strong {
    color: #007bff;
  }
</style>
