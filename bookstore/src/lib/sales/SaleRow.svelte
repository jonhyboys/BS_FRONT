<script>
  let { sale, onTicket, onInvoice } = $props();

  let expanded = $state(false);

  function toggle() {
    expanded = !expanded;
  }

  function formatDate(date) {
    return new Date(date).toLocaleString();
  }

  function handleTicketClick() {
    if (onTicket) {
      onTicket(sale);
    }
  }

  function handleInvoiceClick() {
    if (onInvoice) {
      onInvoice(sale);
    }
  }
</script>

<div class="sale-row">
  <!-- HEADER / ITEM -->
  <div class="sale-header">
    <button
      type="button"
      class="toggle"
      onclick={toggle}
      aria-label="Mostrar sección detalle"
    >
      {expanded ? '▲' : '▼'}
    </button>

    <div class="summary">
      <!-- TITLE -->
      <div class="title">
        {formatDate(sale.date)}
      </div>

      <!-- SUBTITLE -->
      <div class="subtitle">
        Total: ${sale.total}
      </div>

      <!-- DETAIL (DEL ITEM, SIEMPRE VISIBLE) -->
      <div class="detail">
        Base: ${sale.baseTotalAmount} |
        Desc: ${sale.baseTotalDiscount} |
        IVA: ${sale.ivaAmount}
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="actions">
      <button type="button" onclick={handleInvoiceClick}>Factura</button>
      <button type="button" onclick={handleTicketClick}>Ticket</button>
    </div>
  </div>

  <!-- SECCIÓN DETALLE (PLEGABLE) -->
  {#if expanded}
    <div class="sale-items">
      <ul>
        {#each sale.items as item}
          <li>
            {item.productName} ·
            Cant: {item.quantity} ·
            SubTotal: ${item.subTotal}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .sale-row {
    border: 1px solid #ccc;
    padding: 8px;
    margin-bottom: 10px;
    background: #fff;
  }

  .sale-header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .toggle {
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
    margin-top: 4px;
  }

  .summary {
    flex: 1;
  }

  .title {
    font-weight: bold;
  }

  .subtitle {
    font-size: 0.85em;
    color: #555;
  }

  .detail {
    font-size: 0.85em;
    color: #444;
  }

  .actions {
    display: flex;
    gap: 6px;
  }

  .sale-items {
    margin-top: 8px;
    padding-left: 24px;
  }

  ul {
    margin: 0;
    padding-left: 16px;
    list-style: disc;
  }
</style>