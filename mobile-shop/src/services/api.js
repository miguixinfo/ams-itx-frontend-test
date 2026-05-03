const BASE_URL = 'https://itx-frontend-test.onrender.com';
const CACHE_KEY = 'cache_products';
const CACHE_TTL = 3_600_000;

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
