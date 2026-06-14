<script>
  import { onMount } from 'svelte';

  let { sale = $bindable(null), onGenerate = $bindable(null) } = $props();
  let isGenerating = $state(false);

  // Helpers
  const euro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
  const pad2 = (n) => n.toString().padStart(2, '0');

  function fmtDate(isoDate) {
    if (!isoDate) return '';
    let d;
    
    // Si es un string, intentar parsearlo
    if (typeof isoDate === 'string') {
      d = new Date(isoDate);
    } 
    // Si es un Date object, usarlo directamente
    else if (isoDate instanceof Date) {
      d = isoDate;
    } 
    // Si es un número (timestamp), usarlo
    else if (typeof isoDate === 'number') {
      d = new Date(isoDate);
    } 
    // Default
    else {
      return '';
    }

    // Validar que la fecha sea válida
    if (isNaN(d.getTime())) return '';
    
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  // Carga la imagen
  async function loadImage(src) {
    if (!src) return null;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  // Dibuja la marca de agua en la página actual
  function drawWatermark(doc, img, pageIndex, watermark, pageW, pageH) {
    const firstPage = pageIndex === 1;
    const canDraw =
      (firstPage && watermark.showOnFirstPage) ||
      (!firstPage && watermark.showOnOtherPages);
    if (!img || !canDraw) return;

    // Intentar opacidad
    let gOn = false;
    if (doc.GState && doc.setGState) {
      try {
        doc.setGState(new doc.GState({ opacity: watermark.opacity }));
        gOn = true;
      } catch {
        /* fallback sin opacidad */
      }
    }

    // Mantener proporción
    const imgWpx = img.naturalWidth || img.width;
    const imgHpx = img.naturalHeight || img.height;
    if (!imgWpx || !imgHpx) return;

    const imgRatio = imgWpx / imgHpx;
    let drawW, drawH;

    if (watermark.mode === 'cover') {
      const pageRatio = pageW / pageH;
      if (imgRatio > pageRatio) {
        drawH = pageH;
        drawW = drawH * imgRatio;
      } else {
        drawW = pageW;
        drawH = drawW / imgRatio;
      }
    } else {
      drawW = pageW * (watermark.scale ?? 0.6);
      drawH = drawW / imgRatio;
    }

    const x = (pageW - drawW) / 2;
    const y = (pageH - drawH) / 2;

    // Rotación opcional
    if (watermark.rotate) {
      doc.saveGraphicsState?.();
      doc.rotate?.(watermark.rotate, { origin: [pageW / 2, pageH / 2] });
      doc.addImage(img, 'PNG', x, y, drawW, drawH, undefined, 'FAST');
      doc.restoreGraphicsState?.();
    } else {
      doc.addImage(img, 'PNG', x, y, drawW, drawH, undefined, 'FAST');
    }

    // Restablecer opacidad
    if (gOn) {
      doc.setGState(new doc.GState({ opacity: 1 }));
    }
  }

  async function generatePDF() {
    if (!sale) return;
    isGenerating = true;

    console.log('Sale data:', sale);
    console.log('Sale date:', sale.date, 'Type:', typeof sale.date);

    try {
      // Importar las librerías dinámicamente
      const { jsPDF } = await import('jspdf');
      const autotable = (await import('jspdf-autotable')).default;

      // Datos de la empresa
      const company = {
        name: 'Librería Genil',
        nif: '15401323V',
        address: 'Av. María Auxiliadora 5, bajo, 14700, Córdoba',
        contact: 'libreriagenil@gmail.com | +34 957 646 013'
      };

      // Crear documento
      const doc = new jsPDF({ unit: 'mm', format: 'a4', putOnlyUsedFonts: true });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const lm = 14,
        rm = 14,
        top = 15,
        rightX = pageW - rm;

      // Configurar marca de agua
      const watermark = {
        src: '/Genil.png',
        opacity: 0.05,
        scale: 0.6,
        rotate: 0,
        showOnFirstPage: true,
        showOnOtherPages: true,
        mode: 'center'
      };

      // Cargar imágenes
      const headerImg = await loadImage('/Genil.png');
      const wmImage = watermark.src ? await loadImage(watermark.src) : null;

      // Encabezado (logo sin opacidad)
      let y = top + 8;
      if (headerImg) {
        const targetH = 10;
        const ratio = (headerImg.width || 1) / (headerImg.height || 1);
        const targetW = targetH * ratio;

        doc.addImage(headerImg, 'PNG', lm, top - 2, targetW, targetH, undefined, 'FAST');

        // Separador
        doc.setDrawColor(210, 210, 210);
        doc.setLineWidth(0.4);
        doc.line(lm, top - 2 + targetH + 2, pageW - rm, top - 2 + targetH + 2);

        y = top - 2 + targetH + 10;
      }

      // Marca de agua en la primera página
      drawWatermark(doc, wmImage, 1, watermark, pageW, pageH);

      // Encabezados de factura
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(`Factura #${sale.id ?? ''}`, lm, y);

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Fecha: ${fmtDate(sale.date)}`, rightX, y, { align: 'right' });

      // Emisor
      y += 8;
      if (company && (company.name || company.nif || company.address || company.contact)) {
        doc.setFont(undefined, 'bold');
        doc.text('Emisor', lm, y);
        doc.setFont(undefined, 'normal');
        const emitterLines = [
          company.name || '',
          company.nif ? `NIF: ${company.nif}` : '',
          company.address || '',
          company.contact || ''
        ].filter(Boolean);
        emitterLines.forEach((line, i) => doc.text(line, lm, y + 5 + i * 5));
      }

      // Cliente
      const clientX = pageW / 2;
      doc.setFont(undefined, 'bold');
      doc.text('Destinatario', clientX, y);
      doc.setFont(undefined, 'normal');
      const clientLines = [
        `${sale.client?.name ?? ''}`,
        sale.client?.nif ? `NIF: ${sale.client.nif}` : '',
        `${sale.client?.address ?? ''}`.trim(),
        sale.client?.email ? `${sale.client.email}` : ''
      ].filter(Boolean);
      clientLines.forEach((line, i) => doc.text(line, clientX, y + 5 + i * 5));

      const emitterBlockH =
        company && (company.name || company.nif || company.address || company.contact)
          ? 5 + 5 * Math.max(1, (company.name ? 1 : 0) + (company.nif ? 1 : 0) + (company.address ? 1 : 0) + (company.contact ? 1 : 0))
          : 10;
      const clientBlockH = 5 + 5 * Math.max(1, clientLines.length);
      y = Math.max(y + emitterBlockH, y + clientBlockH) + 4;

      // Tabla de productos
      const tableHead = [['Cant.', 'Producto', 'Base', 'Desc.', 'IVA', 'Subtotal']];

      let totalBase = 0,
        totalIva = 0,
        totalDiscount = 0,
        totalPayed = 0;

      const tableBody = (sale.items || []).map((p) => {
        const iva = 21;
        const qty = Number(p.quantity ?? 0);
        const discount = Number(p.discount ?? 0);
        const price = Number(p.price ?? 0);
        const priceBeforeDiscount = round2(qty * price);
        const discountAmount = priceBeforeDiscount * (discount / 100);
        const priceAfterDiscount = priceBeforeDiscount - discountAmount;
        const priceBase = round2(priceAfterDiscount / (iva / 100 + 1));
        const ivaAmount = priceAfterDiscount - priceBase;

        totalBase += priceBase;
        totalIva += ivaAmount;
        totalDiscount += discountAmount;
        totalPayed += priceAfterDiscount;

        return [
          qty,
          String(p.productName ?? ''),
          euro.format(priceBase),
          `${euro.format(discountAmount)} (${discount}%)`,
          `${euro.format(ivaAmount)} (${iva}%)`,
          euro.format(priceBeforeDiscount)
        ];
      });

      totalBase = round2(totalBase);
      totalIva = round2(totalIva);
      totalDiscount = round2(totalDiscount);
      totalPayed = round2(totalPayed);

      autotable(doc, {
        startY: y,
        head: tableHead,
        body: tableBody,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
        theme: 'grid',
        columnStyles: {
          0: { halign: 'right', cellWidth: 12 },
          1: { cellWidth: 80 },
          2: { halign: 'right', cellWidth: 24 },
          3: { halign: 'right', cellWidth: 24 },
          4: { halign: 'right', cellWidth: 24 },
          5: { halign: 'right', cellWidth: 24 }
        },
        bodyStyles: { valign: 'middle' },
        didDrawPage: () => {
          const info = doc.internal.getCurrentPageInfo?.();
          const pageNumber = info?.pageNumber ?? 1;
          drawWatermark(doc, wmImage, pageNumber, watermark, pageW, pageH);
        }
      });

      const endY = doc.lastAutoTable.finalY || y;

      // Totales
      const totalsY = endY + 8;
      doc.setFont(undefined, 'bold');
      doc.text('Base imponible:', rightX - 40, totalsY, { align: 'right' });
      doc.text(euro.format(totalBase), rightX, totalsY, { align: 'right' });

      doc.text('IVA:', rightX - 40, totalsY + 6, { align: 'right' });
      doc.text(euro.format(totalIva), rightX, totalsY + 6, { align: 'right' });

      doc.text('Descuento:', rightX - 40, totalsY + 12, { align: 'right' });
      doc.text(euro.format(totalDiscount), rightX, totalsY + 12, { align: 'right' });

      doc.setFontSize(12);
      doc.text('TOTAL:', rightX - 40, totalsY + 20, { align: 'right' });
      doc.text(euro.format(totalPayed), rightX, totalsY + 20, { align: 'right' });
      doc.setFontSize(10);

      // Salida
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      alert('Error al generar la factura: ' + err.message);
      console.error(err);
    } finally {
      isGenerating = false;
      onGenerate && onGenerate();
    }
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
