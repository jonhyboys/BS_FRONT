const BASE_URL = 'http://localhost:5123/api/Invoices';

export async function createInvoice({ client, sales }) {
  const res = await fetch(BASE_URL, {
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