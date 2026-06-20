const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = 'Categories';

// =======================
// GET ALL
// =======================
export async function getCategories() {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}`);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return await res.json();
}

// =======================
// SEARCH BY NAME
// =======================
export async function searchCategoriesByName(name) {
  const encoded = encodeURIComponent(name);
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/search/name/${encoded}`);
  if (!res.ok) throw new Error('Error al buscar categorías');
  return await res.json();
}

// =======================
// CREATE
// =======================
export async function createCategory(category) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}`, {
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
  const cleanedCategory = {
    id: category.id,
    name: category.name,
    motherCategory: category.motherCategoryId  
  };
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/${category.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cleanedCategory)
  });
  if (!res.ok) throw new Error('Error al actualizar categoría');
  return await res.json();
}

// =======================
// DELETE
// =======================
export async function deleteCategory(id) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar categoría');
}
