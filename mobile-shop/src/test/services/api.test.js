import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProducts, getProductById, addToCart } from '../../services/api';

const CACHE_KEY = 'cache_products';
const TTL = 3_600_000;

const MOCK_PRODUCTS = [
  { id: 'ZG001', brand: 'Nimbus', model: 'Aero 14 Pro', price: 949, imgUrl: '' },
];

const MOCK_PRODUCT = {
  id: 'ZG001',
  brand: 'Nimbus',
  model: 'Aero 14 Pro',
  price: '949.00',
};

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

describe('getProductById', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns cached data without calling the API when cache is fresh', async () => {
    localStorage.setItem(
      'cache_product_ZG001',
      JSON.stringify({ data: MOCK_PRODUCT, timestamp: Date.now() })
    );

    const result = await getProductById('ZG001');

    expect(result).toEqual(MOCK_PRODUCT);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches from the API when no cache entry exists', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => MOCK_PRODUCT });

    const result = await getProductById('ZG001');

    expect(fetch).toHaveBeenCalledOnce();
    expect(result).toEqual(MOCK_PRODUCT);
  });

  it('fetches from the API when the cached entry has expired', async () => {
    localStorage.setItem(
      'cache_product_ZG001',
      JSON.stringify({ data: MOCK_PRODUCT, timestamp: Date.now() - TTL - 1 })
    );
    fetch.mockResolvedValueOnce({ ok: true, json: async () => MOCK_PRODUCT });

    const result = await getProductById('ZG001');

    expect(fetch).toHaveBeenCalledOnce();
    expect(result).toEqual(MOCK_PRODUCT);
  });

  it('uses a per-product cache key scoped to the product id', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => MOCK_PRODUCT });

    await getProductById('ZG001');

    const stored = JSON.parse(localStorage.getItem('cache_product_ZG001'));
    expect(stored.data).toEqual(MOCK_PRODUCT);
    expect(stored.timestamp).toBeGreaterThan(0);
  });

  it('does not mix cache entries for different product ids', async () => {
    localStorage.setItem(
      'cache_product_ZG001',
      JSON.stringify({ data: MOCK_PRODUCT, timestamp: Date.now() })
    );
    const other = { ...MOCK_PRODUCT, id: 'ZG002' };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => other });

    const result = await getProductById('ZG002');

    expect(fetch).toHaveBeenCalledOnce();
    expect(result).toEqual(other);
  });

  it('throws when the API returns a non-OK status', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(getProductById('ZG001')).rejects.toThrow('API error: 404');
  });
});

describe('addToCart', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a POST to /api/cart with the correct JSON payload', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ count: 3 }) });

    await addToCart({ id: 'ZG001', colorCode: 1000, storageCode: 2000 });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/cart'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: 'ZG001', colorCode: 1000, storageCode: 2000 }),
      })
    );
  });

  it('returns the count from the API response', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ count: 5 }) });

    const result = await addToCart({ id: 'ZG001', colorCode: 1000, storageCode: 2000 });

    expect(result.count).toBe(5);
  });

  it('throws when the API returns a non-OK status', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(
      addToCart({ id: 'ZG001', colorCode: 1000, storageCode: 2000 })
    ).rejects.toThrow('API error: 500');
  });
});
