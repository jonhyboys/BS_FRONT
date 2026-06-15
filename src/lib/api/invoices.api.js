const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = 'Invoices';

export async function getInvoiceBySaleId(saleId) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/sale/${saleId}`);
  
  if (res.status === 404) {
    return null;
  }
  
  if (!res.ok) {
    throw new Error('Error al obtener la factura');
  }

  return await res.json();
}

export async function createInvoice({ client, sales }) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ client, sales })
  });

  if (!res.ok) {
    throw new Error('Error al crear la factura');
  }

  return await res.json();
}