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
  <div class="summary-details">
    <div>
      <span>Monto Base:</span>
      <span>{summary.baseTotalAmount.toFixed(2)}</span>
    </div>
    <div>
      <span>Descuento:</span>
      <span>-{summary.totalDiscount.toFixed(2)}</span>
    </div>
    <div>
      <span>IVA:</span>
      <span>{summary.ivaAmount.toFixed(2)}</span>
    </div>
    <div>
      <span>Total:</span>
      <span>{summary.total.toFixed(2)}</span>
    </div>
  </div>
</div>

<style>
  .summary-details {
    display: flex;
    flex-direction: column;
    font-weight: bold;
    gap: 0.5em;
    padding: 0.5em 0;
  }

  .summary-details > div {
    display: flex;
    justify-content: space-between;
  }
</style>
