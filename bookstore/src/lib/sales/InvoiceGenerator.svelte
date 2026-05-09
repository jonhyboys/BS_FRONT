<script>
  import { onMount } from 'svelte';

  let { sale = $bindable(null) } = $props();

  let isGenerating = $state(false);

  async function generatePDF() {
    if (!sale) return;

    isGenerating = true;

    try {
      // Importar las librerías dinámicamente
      const jsPDF = (await import('jspdf')).jsPDF;
      const html2canvas = (await import('html2canvas')).default;

      // Crear elemento temporal con el contenido de la factura
      const invoiceElement = document.createElement('div');
      invoiceElement.innerHTML = getInvoiceHTML();
      invoiceElement.style.position = 'absolute';
      invoiceElement.style.left = '-9999px';
      invoiceElement.style.width = '210mm';
      invoiceElement.style.backgroundColor = 'white';
      document.body.appendChild(invoiceElement);

      // Convertir HTML a canvas
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Abrir en nueva pestaña
      const pdfUrl = pdf.output('bloburi');
      window.open(pdfUrl, '_blank');

      // Limpiar
      document.body.removeChild(invoiceElement);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Error al generar la factura: ' + err.message);
    } finally {
      isGenerating = false;
    }
  }

  function getInvoiceHTML() {
    return `
      <div class="invoice-container">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            color: #333;
          }
          
          .invoice-container {
            width: 210mm;
            height: 297mm;
            padding: 20mm;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595 842"><rect fill="white" width="595" height="842"/></svg>');
            position: relative;
            overflow: hidden;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 15px;
          }
          
          .logo-section {
            flex: 1;
          }
          
          .logo {
            width: 80px;
            height: auto;
          }
          
          .title-section {
            flex: 1;
            text-align: right;
          }
          
          .title-section h1 {
            font-size: 28px;
            margin-bottom: 5px;
            color: #007bff;
          }
          
          .title-section p {
            font-size: 12px;
            color: #666;
          }
          
          .info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .info-block h3 {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
            color: #333;
          }
          
          .info-block p {
            font-size: 11px;
            line-height: 1.6;
            color: #555;
            margin: 3px 0;
          }
          
          .table-section {
            margin-bottom: 30px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }
          
          thead {
            background-color: #f0f0f0;
            border-top: 1px solid #ddd;
            border-bottom: 2px solid #007bff;
          }
          
          th {
            padding: 10px;
            text-align: left;
            font-weight: bold;
            color: #333;
          }
          
          td {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          
          tr:last-child td {
            border-bottom: 2px solid #ddd;
          }
          
          .text-right {
            text-align: right;
          }
          
          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
          }
          
          .totals {
            width: 250px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 12px;
            border-bottom: 1px solid #eee;
          }
          
          .total-row.final {
            border-bottom: 2px solid #007bff;
            border-top: 2px solid #007bff;
            font-weight: bold;
            font-size: 14px;
            padding: 12px 0;
            color: #007bff;
          }
          
          .footer {
            text-align: center;
            font-size: 10px;
            color: #999;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #eee;
          }
        </style>
        
        <div class="header">
          <div class="logo-section">
            <div style="font-weight: bold; font-size: 16px; color: #007bff;">GENIL</div>
            <div style="font-size: 12px; color: #666;">PAPELERÍA - LIBRERÍA</div>
          </div>
          <div class="title-section">
            <h1>Factura #${sale.id}</h1>
            <p>Fecha: ${formatDate(sale.date)}</p>
          </div>
        </div>
        
        <div class="info-section">
          <div class="info-block">
            <h3>Emisor</h3>
            <p><strong>Librería Genil</strong></p>
            <p>NIF: 15401323V</p>
            <p>Av. María Auxiliadora 5, bajo</p>
            <p>14700, Córdoba</p>
            <p>libreriagenil@gmail.com | +34 957 646 013</p>
          </div>
          <div class="info-block">
            <h3>Destinatario</h3>
            <p><strong>${sale.client?.name || 'Cliente'}</strong></p>
            <p>NIF: ${sale.client?.nif || '-'}</p>
            <p>Dirección: ${sale.client?.address || '-'}</p>
          </div>
        </div>
        
        <div class="table-section">
          <table>
            <thead>
              <tr>
                <th>Cant.</th>
                <th>Producto</th>
                <th class="text-right">Base</th>
                <th class="text-right">Desc.</th>
                <th class="text-right">IVA</th>
                <th class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${sale.items.map(item => `
                <tr>
                  <td>${item.quantity}</td>
                  <td>${item.productName}</td>
                  <td class="text-right">${(item.price * item.quantity).toFixed(2)} €</td>
                  <td class="text-right">${item.discount > 0 ? `${(item.price * item.quantity * (item.discount / 100)).toFixed(2)} € (${item.discount}%)` : '0,00 €'}</td>
                  <td class="text-right">${(item.ivaAmount || 0).toFixed(2)} € (${item.iva}%)</td>
                  <td class="text-right">${item.subTotal.toFixed(2)} €</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="totals-section">
          <div class="totals">
            <div class="total-row">
              <span>Base imponible:</span>
              <span>${sale.baseTotalAmount.toFixed(2)} €</span>
            </div>
            <div class="total-row">
              <span>IVA:</span>
              <span>${sale.ivaAmount.toFixed(2)} €</span>
            </div>
            <div class="total-row">
              <span>Descuento:</span>
              <span>${sale.baseTotalDiscount.toFixed(2)} €</span>
            </div>
            <div class="total-row final">
              <span>TOTAL:</span>
              <span>${sale.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Gracias por su compra</p>
        </div>
      </div>
    `;
  }

  function formatDate(date) {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  onMount(() => {
    if (sale) {
      generatePDF();
    }
  });
</script>

<div class="invoice-generator">
  {#if isGenerating}
    <p>Generando factura...</p>
  {/if}
</div>

<style>
  .invoice-generator {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    display: none;
  }

  .invoice-generator:has(p) {
    display: block;
  }
</style>
