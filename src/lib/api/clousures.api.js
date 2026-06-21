const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = 'Clousures';

export async function createClousure(saleIds) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sales: saleIds
    })
  });

  if (!res.ok) {
    throw new Error('Error al cerrar el día');
  }

  return await res.json();
}

export async function getClousuresRange(fromDate, toDate) {
  const from = new Date(fromDate).toISOString();
  const to = new Date(toDate).toISOString();
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/range?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  if (!res.ok) throw new Error('Error al obtener cierres del rango');
  return await res.json();
}