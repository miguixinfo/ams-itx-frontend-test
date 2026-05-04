const BASE_URL = 'https://itx-frontend-test.onrender.com';
const CACHE_KEY = 'cache_products';
const CACHE_TTL = 3_600_000;

export async function getProductById(id) {
  const cacheKey = `cache_product_${id}`;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const { data, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
  } catch {}

  const res = await fetch(`${BASE_URL}/api/product/${id}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}

  return data;
}

export async function addToCart({ id, colorCode, storageCode }) {
  const res = await fetch(`${BASE_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, colorCode, storageCode }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getProducts() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const { data, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
  } catch {}

  const res = await fetch(`${BASE_URL}/api/product`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}

  return data;
}
