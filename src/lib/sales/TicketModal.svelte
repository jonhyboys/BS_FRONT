<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faRectangleXmark, faPrint } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/button/IconButton.svelte';
  let { isOpen = $bindable(false), sale = $bindable(null) } = $props();

  function handlePrint() { window.print(); }

  function handleClose() { isOpen = false;}

  function formatDate(date) {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
  
  function calculateSubtotal(item) {
    const baseAmount = item.quantity * item.price;
    const discountAmount = baseAmount * (item.discount / 100);
    return baseAmount - discountAmount;
  }
</script>

{#if isOpen && sale}
  <div class="modal-overlay" /*onclick={() => (isOpen = false)}*/>
    <div class="modal print-area">
      <h2>-- Ticket de Compra --</h2>
      <div class="modal-body">
        <div class="header">
          <p><strong>NIF: </strong>12345678A</p>
          <p><strong>Venta: </strong> #{sale.id}</p>
          <p><strong>Fecha: </strong> {formatDate(sale.date)}</p>
          <p><strong>Teléfono: </strong> 123 456 789</p>
        </div>
        <div class="items">
          {#each sale.items as item}
            <div class="item">
              <div>
                <div class="item-name">
                  <span>{item.quantity}</span> - 
                  <span>{item.productName}</span>
                </div>
                <div>c/u &nbsp;&nbsp;{item.price.toFixed(2)}</div>
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
        <div class="summary">
          <div>
            <strong>Monto Base:</strong>
            <span>{sale.baseTotalAmount.toFixed(2)}</span>
          </div>
          {#if sale.baseTotalDiscount > 0}
            <div>
              <strong>Descuento:</strong>
              <span>-{sale.baseTotalDiscount.toFixed(2)}</span>
            </div>
          {/if}
          <div>
            <strong>IVA:</strong>
            <span>{sale.ivaAmount.toFixed(2)}</span>
          </div>
          <div>
            <strong>Total a pagar:</strong>
            <span>{sale.total.toFixed(2)}</span>
          </div>
        </div>
        <div class="footer">
          <p>libreriagenil@gmail.com</p>
          <p>¡Gracias por su compra!</p>
        </div>
      </div>
      <div class="actions">
        <IconButton size="2x" icon={faPrint} label="Imprimir" onclick={handlePrint} disabled={sale.items.length === 0} />
        <IconButton size="2x" icon={faRectangleXmark} label="Cerrar" onclick={handleClose} />
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
    font-family: 'Courier New', Courier, monospace;
    max-width: 400px;
    padding: 1em;
  }

  h2 {
    font-size: 1em;
    margin: 1em 0;
    text-align: center;
  }

  .items {
    border-top: 1px dashed #000;
    border-bottom: 1px dashed #000;
    margin: 1em 0;
    padding: 0.5em 0;
  }

  .item {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0.5em;
  }

  .item > div,
  .summary > div {
    display: flex;
    gap: 1em;
    justify-content: space-between;
  }

  .item-name + div {
    white-space: nowrap;
  }

  .footer {
    font-size: 0.8em;
    margin-top: 3em;
    text-align: center;
  }

  .actions {
    display: flex;
    gap: 1em;
    justify-content: space-between;
    margin-top: 1em;
  }

  @media print {
    body {
      margin: 0;
      padding: 0;
    }

    .modal-overlay {
      display: none;
    }

    .modal {
      width: 100%;
      max-width: 100%;
      max-height: 100%;
      border-radius: 0;
      box-shadow: none;
    }

    .modal-header,
    .modal-footer {
      display: none;
    }

    .modal-body {
      padding: 0;
      max-height: 100%;
    }

    .print-area {
      page-break-inside: avoid;
    }
  }
</style>
