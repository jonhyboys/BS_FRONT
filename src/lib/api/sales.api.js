const BASE_URL = 'http://localhost:5123/api/Sales';

export async function getSales(page = 1) {
  const res = await fetch(`${BASE_URL}?page=${page}`);
  if (!res.ok) throw new Error('Error al obtener ventas');
  return await res.json();
}

export async function getSalesByDate(date) {
  const dateStr = date.toISOString().split('T')[0];
  const res = await fetch(`${BASE_URL}/date?date=${dateStr}`);
  if (!res.ok) throw new Error('Error al obtener ventas del día');
  return await res.json();
}

export async function createSale(sale) {
  const res = await fetch(BASE_URL, {
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
  const res = await fetch(`${BASE_URL}/${sale.id}`, {
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
  const res = await fetch(`${BASE_URL}/pending-clousure`);
  if (!res.ok) throw new Error('Error al obtener ventas pendientes');
  return await res.json();
}
