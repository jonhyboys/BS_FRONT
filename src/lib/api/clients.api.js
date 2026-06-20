const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = 'Clients';

// =======================
// GET ALL
// =======================
export async function getClients() {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}`);
  if (!res.ok) throw new Error('Error al obtener clientes');
  return await res.json();
}

// =======================
// SEARCH
// =======================
export async function searchClientsByName(query) {
  const encoded = encodeURIComponent(query);
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/search/name/${encoded}`);
  if (!res.ok) throw new Error('Error al buscar clientes');
  return await res.json();
}

// =======================
// CREATE
// =======================
export async function createClient(client) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(client)
  });

  if (!res.ok) throw new Error('Error al crear cliente');
  return await res.json();
}

// =======================
// UPDATE
// =======================
export async function updateClient(client) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/${client.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(client)
  });

  if (!res.ok) throw new Error('Error al actualizar cliente');
  return await res.json();
}

// =======================
// DELETE
// =======================
export async function deleteClient(id) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) throw new Error('Error al eliminar cliente');
}
