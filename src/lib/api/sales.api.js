const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = 'Sales';

export async function getSales(page = 1) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}?page=${page}`);
  if (!res.ok) throw new Error('Error al obtener ventas');
  return await res.json();
}

export async function getSalesByDate(date) {
  const dateStr = date.toISOString().split('T')[0];
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/date?date=${dateStr}`);
  if (!res.ok) throw new Error('Error al obtener ventas del día');
  return await res.json();
}

export async function getSalesRange(fromDate, toDate) {
  // Convertir las fechas a ISO string (date-time format)
  const from = new Date(fromDate).toISOString();
  const to = new Date(toDate).toISOString();
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/range?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  if (!res.ok) throw new Error('Error al obtener ventas del rango');
  return await res.json();
}

export async function createSale(sale) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sale)
  });

  if (!res.ok) throw new Error('Error al crear venta');
  return await res.json();
}

export async function updateSale(sale) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/${sale.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sale)
  });

  if (!res.ok) throw new Error('Error al actualizar venta');
  return await res.json();
}

export async function deleteSale(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) throw new Error('Error al eliminar venta');
}

export async function getPendingSales() {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/pending-clousure`);
  if (!res.ok) throw new Error('Error al obtener ventas pendientes');
  return await res.json();
}

export async function getSalesByClousure(clousureId) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/clousure/${clousureId}`);
  if (!res.ok) throw new Error('Error al obtener ventas del cierre');
  return await res.json();
}