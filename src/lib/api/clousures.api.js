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