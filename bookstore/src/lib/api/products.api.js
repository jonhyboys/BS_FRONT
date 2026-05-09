const BASE_URL = 'http://localhost:5123/api/Products';

export async function getProducts(page = 1) {
  const res = await fetch(`${BASE_URL}?page=${page}`);
  if (!res.ok) throw new Error('Error al obtener productos');
  return await res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener producto');
  return await res.json();
}

export async function getProductByCode(code) {
  const res = await fetch(`${BASE_URL}/code/${code}`);
  if (!res.ok) throw new Error('Error al obtener producto');
  return await res.json();
}

export async function searchProducts(query, page = 1) {
  const encoded = encodeURIComponent(query);
  const res = await fetch(`${BASE_URL}/query/${encoded}?page=${page}`);
  if (!res.ok) throw new Error('Error al buscar productos');
  return await res.json();
}

export async function createProduct(product) {
  const res = await fetch(BASE_URL, {
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
  
  // Limpiar el objeto para enviar solo los campos que espera el backend
  const cleanProduct = {
    id: product.id,
    code: product.code,
    name: product.name,
    category: product.categoryId,
    cost: product.cost,
    price: product.price,
    promotion: product.promotion,
    quantity: product.quantity,
    iva: product.iva
  };
  
  const res = await fetch(`${BASE_URL}/${cleanProduct.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cleanProduct)
  });

  if (!res.ok) throw new Error('Error al actualizar producto');
  return await res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) throw new Error('Error al eliminar producto');
}
