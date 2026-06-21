const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = 'Products';

export async function getProducts(page = 1, pageSize = 10) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error('Error al obtener productos');
  return await res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/${id}`);
  if (!res.ok) throw new Error('Error al obtener producto');
  return await res.json();
}

export async function getProductByCode(code) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/code/${code}`);
  if (!res.ok) throw new Error('Error al obtener producto');
  return await res.json();
}

export async function searchProducts(query, page = 1, pageSize = 10) {
  const encoded = encodeURIComponent(query);
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/query/${encoded}?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error('Error al buscar productos');
  return await res.json();
}

export async function createProduct(product) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });

  if (!res.ok) throw new Error('Error al crear producto');
  return await res.json();
}

export async function updateProduct(product) {
  const cleanProduct = {
    id: product.id,
    code: product.code,
    name: product.name,
    category: product.category,
    cost: product.cost,
    price: product.price,
    promotion: product.promotion,
    quantity: product.quantity,
    iva: product.iva
  };
  
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/${cleanProduct.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cleanProduct)
  });

  if (!res.ok) { throw new Error('Error al actualizar producto'); }
  return await res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/${ENDPOINT}/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) throw new Error('Error al eliminar producto');
}
