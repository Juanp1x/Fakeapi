// conexion.js — adaptado a la documentación oficial
const API_BASE = 'https://fakeapi.net';
// obtiene productos con paginación y filtros
// page, limit, search, searchFields, category, priceMin, priceMax, sort, order
async function obtenerProductos(params = {}) {
  const {
    page = 1,
    limit = 20,
    search = '',
    searchFields = '',
    category = '',
    priceMin = null,
    priceMax = null,
    sort = '',
    order = 'asc'
  } = params;

  let url = `${API_BASE}/products?page=${page}&limit=${limit}`;

  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (searchFields) url += `&searchFields=${encodeURIComponent(searchFields)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (sort) url += `&sort=${encodeURIComponent(sort)}&order=${encodeURIComponent(order)}`;
  if (priceMin !== null || priceMax !== null) {
    const priceObj = { min: priceMin || 0, max: priceMax || 9999999 };
    url += `&price=${encodeURIComponent(JSON.stringify(priceObj))}`;
  }

  console.log('Fetch URL:', url);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    // según docs: { data: [...], pagination: {...} }
    const data = Array.isArray(json) ? json : (json.data || []);
    const pagination = json.pagination || null;

    return { data, pagination };
  } catch (err) {
    console.error('Error obtenerProductos:', err);
    return { data: [], pagination: null };
  }
}

async function obtenerProductoPorId(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error obtenerProductoPorId:', err);
    return null;
  }
}

async function obtenerCategorias() {
  try {
    const res = await fetch(`${API_BASE}/products/categories`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // puede devolver array directo
    if (Array.isArray(json)) return json;
    return json.data || json.categories || [];
  } catch (err) {
    console.error('Error obtenerCategorias:', err);
    return [];
  }
}
