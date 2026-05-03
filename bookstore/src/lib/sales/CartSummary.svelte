<script>
  let { items = [] } = $props();

  function calculateSummary() {
    let baseTotalAmount = 0;
    let totalDiscount = 0;
    let ivaAmount = 0;

    items.forEach((item) => {
      const baseAmount = item.quantity * item.price;
      baseTotalAmount += baseAmount;

      const discountAmount = baseAmount * (item.discount / 100);
      totalDiscount += discountAmount;

      const subTotal = baseAmount - discountAmount;
      const iva = subTotal * (item.iva / 100);
      ivaAmount += iva;
    });

    const total = baseTotalAmount - totalDiscount + ivaAmount;

    return {
      baseTotalAmount,
      totalDiscount,
      ivaAmount,
      total
    };
  }

  let summary = $derived(calculateSummary());
</script>

<div class="cart-summary">
  <h3>Resumen</h3>
  <div class="summary-items">
    <div class="summary-row">
      <span class="label">Monto Base:</span>
      <span class="value">${summary.baseTotalAmount.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span class="label">Descuento:</span>
      <span class="value">-${summary.totalDiscount.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span class="label">IVA:</span>
      <span class="value">${summary.ivaAmount.toFixed(2)}</span>
    </div>
    <div class="summary-row total">
      <span class="label">Total:</span>
      <span class="value">${summary.total.toFixed(2)}</span>
    </div>
  </div>
</div>

<style>
  .cart-summary {
    padding: 15px;
    background: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #ddd;
  }

  .cart-summary h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.1em;
  }

  .summary-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    font-size: 0.95em;
  }

  .summary-row.total {
    border-top: 2px solid #ddd;
    padding-top: 12px;
    margin-top: 5px;
    font-weight: 600;
    font-size: 1.1em;
  }

  .label {
    color: #666;
  }

  .value {
    font-weight: 600;
    color: #333;
  }

  .summary-row.total .value {
    color: #007bff;
  }
</style>
