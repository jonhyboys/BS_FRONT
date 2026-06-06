<script>
  import SaleRow from './SaleRow.svelte';
  import TicketModal from './TicketModal.svelte';
  import InvoiceGenerator from './InvoiceGenerator.svelte';
  import InvoiceClientForm from '$lib/invoices/InvoiceClientForm.svelte';
  import { getInvoiceBySaleId, createInvoice } from '$lib/api/invoices.api.js';
  import AppModal from '$lib/modal/AppModal.svelte';

  let { 
    sales = [], 
    isLoading = false, 
    error = null
  } = $props();
  let isTicketModalOpen = $state(false);
  let isInvoiceModalOpen = $state(false);
  let invoiceSalePending = $state(null);
  let invoiceSale = $state(null);
  let selectedSale = $state(null);

  function handleTicketClick(sale) {
    selectedSale = sale;
    isTicketModalOpen = true;
  }

  async function handleInvoiceClick(sale) {
    try {
      if(sale.invoice === 0) {
        let confirm = window.confirm('Esta venta no tiene factura asociada, ¿quiere generar una?');
        if (confirm){
          invoiceSalePending = sale;
          isInvoiceModalOpen = true;
        } 
        else { return; }
      }
      else {
        const existingInvoice = await getInvoiceBySaleId(sale.id);      
        if (existingInvoice) {
          invoiceSale = {
            ...sale,
            client: existingInvoice.client
          };
        } else {
          alert('No se encontró la factura para esta venta. Comuniquese con soporte.');
        }
      }      
    } catch (err) { alert(err.message); }
  }

  async function handleInvoiceClientSelected(client) {
    try {
      await createInvoice({
        client: client.id,
        sales: [invoiceSalePending.id]
      });

      invoiceSale = {
        ...invoiceSalePending,
        client
      };
    }
    catch (err) { alert(err.message); }
    finally {
      isInvoiceModalOpen = false;
      invoiceSalePending = null;
    }
  }

  function cancelInvoice() {
    isInvoiceModalOpen = false;
    invoiceSalePending = null;
  }
</script>

<div class="sales">
{#if !isLoading && !error && sales.length > 0}
    <div class="sales-summary">
    <span>Número de ventas: {sales.length}</span>
    <span>Monto de ventas: {sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}</span>
    </div>
{/if}
{#if isLoading}
    <p>Cargando...</p>
{:else if error}
    <p>{error}</p>
{:else if sales.length === 0}
    <p>No hay ventas.</p>
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

<TicketModal
  bind:isOpen={isTicketModalOpen}
  bind:sale={selectedSale}
/>

<AppModal
  title="Seleccionar cliente"
  onCancel={cancelInvoice}
  onSave={() => handleInvoiceClientSelected(invoiceSalePending.client)}
  bind:isOpen={isInvoiceModalOpen}
>
  <InvoiceClientForm />  
</AppModal>

{#if invoiceSale}
  <InvoiceGenerator bind:sale={invoiceSale} />
{/if}

<style>
  .sales { margin: 0 1em;}

  .sales-list { margin-top: 1em; }

  .sales-summary {
    display: flex;
    justify-content: space-between;
  }
</style>
