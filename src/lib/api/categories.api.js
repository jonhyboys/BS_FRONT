const BASE_URL = 'http://localhost:5123/api/Categories';

// =======================
// GET ALL
// =======================
export async function getCategories() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return await res.json();
}

// =======================
// SEARCH BY NAME
// =======================
export async function searchCategoriesByName(name) {
  const encoded = encodeURIComponent(name);
  const res = await fetch(`${BASE_URL}/search/name/${encoded}`);
  if (!res.ok) throw new Error('Error al buscar categorías');
  return await res.json();
}

// =======================
// CREATE
// =======================
export async function createCategory(category) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  if (!res.ok) throw new Error('Error al crear categoría');
  return await res.json();
}

// =======================
// UPDATE
// =======================
export async function updateCategory(category) {
  const res = await fetch(`${BASE_URL}/${category.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  if (!res.ok) throw new Error('Error al actualizar categoría');
  return await res.json();
}

// =======================
// DELETE
// =======================
export async function deleteCategory(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar categoría');
}
