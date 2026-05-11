const BASE_URL = 'http://localhost:5123/api/Clousures';

export async function createClousure(saleIds) {
  const res = await fetch(BASE_URL, {
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