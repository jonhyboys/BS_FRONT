<script>
  let { isOpen = $bindable(false), sale = $bindable(null) } = $props();

  function handlePrint() {
    window.print();
  }

  function handleClose() {
    isOpen = false;
  }

  function formatDate(date) {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
</script>

{#if isOpen && sale}
  <div class="modal-overlay" onclick={() => (isOpen = false)}>
    <div class="modal" onclick={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h2>Ticket de Compra</h2>
        <button
          type="button"
          class="close-btn"
          onclick={handleClose}
        >
          ×
        </button>
      </div>

      <div class="modal-body print-area">
        <div class="ticket-header">
          <div class="store-name">Librería Genil</div>
          <div class="ticket-number">Venta #{sale.id}</div>
          <div class="ticket-date">Fecha: {formatDate(sale.date)}</div>
        </div>

        <div class="separator"></div>

        <div class="ticket-items">
          {#each sale.items as item}
            <div class="ticket-item">
              <div class="item-name">{item.productName}</div>
              <div class="item-details">
                <span>{item.quantity} x {item.price.toFixed(2)} €</span>
                {#if item.discount > 0}
                  <span>Desc({item.discount}%): -{(item.price * item.quantity * (item.discount / 100)).toFixed(2)} €</span>
                {/if}
                <span class="item-total">Subtotal: {item.subTotal.toFixed(2)} €</span>
              </div>
            </div>
          {/each}
        </div>

        <div class="separator"></div>

        <div class="ticket-summary">
          <div class="summary-row">
            <span>Monto Base:</span>
            <span>{sale.baseTotalAmount.toFixed(2)} €</span>
          </div>
          {#if sale.baseTotalDiscount > 0}
            <div class="summary-row">
              <span>Descuento:</span>
              <span>-{sale.baseTotalDiscount.toFixed(2)} €</span>
            </div>
          {/if}
          <div class="summary-row">
            <span>IVA:</span>
            <span>{sale.ivaAmount.toFixed(2)} €</span>
          </div>
          <div class="summary-row total">
            <span>Total a pagar:</span>
            <span>{sale.total.toFixed(2)} €</span>
          </div>
        </div>

        <div class="separator"></div>

        <div class="ticket-footer">
          <div class="store-email">libreriagenil@gmail.com</div>
          <div class="thank-you">Gracias por su compra</div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" onclick={handlePrint} class="btn-print">
          Imprimir
        </button>
        <button type="button" onclick={handleClose} class="btn-close">
          Cerrar
        </button>
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
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
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
    flex: 1;
    padding: 30px 20px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    line-height: 1.6;
    overflow-y: auto;
  }

  .ticket-header {
    text-align: center;
    margin-bottom: 15px;
  }

  .store-name {
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 8px;
  }

  .ticket-number,
  .ticket-date {
    font-size: 0.9em;
    color: #666;
  }

  .separator {
    border-top: 1px dashed #ccc;
    margin: 15px 0;
  }

  .ticket-items {
    margin-bottom: 10px;
  }

  .ticket-item {
    margin-bottom: 12px;
  }

  .item-name {
    font-weight: 600;
    margin-bottom: 3px;
  }

  .item-details {
    display: flex;
    flex-direction: column;
    gap: 3px;
    font-size: 0.85em;
    color: #555;
  }

  .item-total {
    font-weight: 600;
    color: #000;
  }

  .ticket-summary {
    margin: 15px 0;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 0.95em;
  }

  .summary-row.total {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 8px 0;
    margin-top: 10px;
    font-weight: bold;
    font-size: 1.05em;
  }

  .ticket-footer {
    text-align: center;
    margin-top: 15px;
  }

  .store-email {
    font-size: 0.85em;
    color: #666;
    margin-bottom: 5px;
  }

  .thank-you {
    font-weight: 600;
    margin-top: 10px;
  }

  .modal-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 20px;
    border-top: 1px solid #eee;
    background: #f9f9f9;
  }

  .btn-print,
  .btn-close {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95em;
    font-weight: 600;
  }

  .btn-print {
    background-color: #007bff;
    color: white;
  }

  .btn-print:hover {
    background-color: #0056b3;
  }

  .btn-close {
    background-color: #6c757d;
    color: white;
  }

  .btn-close:hover {
    background-color: #545b62;
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
