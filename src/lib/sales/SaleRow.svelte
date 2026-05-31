<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faSquareCaretDown, faSquareCaretUp, faReceipt, faFilePdf } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/button/IconButton.svelte';

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

  function calculateSubtotal(item) {
    const baseAmount = item.quantity * item.price;
    const discountAmount = baseAmount * (item.discount / 100);
    return baseAmount - discountAmount;
  }
</script>

<div class="sale-row">
  <div class="sale-header">
    {#if expanded}
      <IconButton size="2x" icon={faSquareCaretUp} label="Ocultar detalle" onclick={toggle} />
    {:else}
      <IconButton size="2x" icon={faSquareCaretDown} label="Mostrar detalle" onclick={toggle} />
    {/if}
    <div class="summary">
      <div class="title">{formatDate(sale.date)}</div>
      <div class="detail">
        Base: {sale.baseTotalAmount} |
        Desc: {sale.baseTotalDiscount} |
        IVA: {sale.ivaAmount} |
        Total: {sale.totalAmount}
      </div>
    </div>
    <div>
      <IconButton size="2x" icon={faFilePdf} label="Factura" onclick={handleInvoiceClick} />
      <IconButton size="2x" icon={faReceipt} label="Ticket" onclick={handleTicketClick} />
    </div>
  </div>
  {#if expanded}
    <div class="sale-items">
        {#each sale.items as item}
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
        {/each}
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

  .summary { flex: 1; }

  .title { font-weight: bold; }

  .detail {
    font-size: 0.85em;
    color: #444;
  }

  .item-details {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0.5em 1.5em;
  }

  .item-details > div {
    display: flex;
    justify-content: space-between;
  }

  .item-name {
    font-style: italic;
  }
</style>