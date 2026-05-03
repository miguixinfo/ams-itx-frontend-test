import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProducts } from '../../services/api';

const CACHE_KEY = 'cache_products';
const TTL = 3_600_000;

const MOCK_PRODUCTS = [
  { id: 'ZG001', brand: 'Nimbus', model: 'Aero 14 Pro', price: 949, imgUrl: '' },
];

describe('getProducts', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns cached data without calling the API when cache is fresh', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: MOCK_PRODUCTS, timestamp: Date.now() }));

    const result = await getProducts();

    expect(result).toEqual(MOCK_PRODUCTS);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches from the API when no cache entry exists', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => MOCK_PRODUCTS });

    const result = await getProducts();

    expect(fetch).toHaveBeenCalledOnce();
    expect(result).toEqual(MOCK_PRODUCTS);
  });

  it('fetches from the API when the cached entry has expired', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: MOCK_PRODUCTS,
      timestamp: Date.now() - TTL - 1,
    }));
    fetch.mockResolvedValueOnce({ ok: true, json: async () => MOCK_PRODUCTS });

    const result = await getProducts();

    expect(fetch).toHaveBeenCalledOnce();
    expect(result).toEqual(MOCK_PRODUCTS);
  });

  it('saves the API response to localStorage after a successful fetch', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => MOCK_PRODUCTS });

    await getProducts();

    const stored = JSON.parse(localStorage.getItem(CACHE_KEY));
    expect(stored.data).toEqual(MOCK_PRODUCTS);
    expect(stored.timestamp).toBeGreaterThan(0);
  });

  it('throws when the API returns a non-OK status', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(getProducts()).rejects.toThrow('API error: 500');
  });
});
