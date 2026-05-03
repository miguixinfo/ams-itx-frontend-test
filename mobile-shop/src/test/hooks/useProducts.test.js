import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProducts } from '../../hooks/useProducts';
import * as api from '../../services/api';

const MOCK_PRODUCTS = [
  { id: 'ZG001', brand: 'Nimbus', model: 'Aero 14 Pro', price: 949 },
];

describe('useProducts', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with loading: true and empty products', () => {
    vi.spyOn(api, 'getProducts').mockResolvedValue(MOCK_PRODUCTS);

    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('sets products and loading: false after a successful fetch', async () => {
    vi.spyOn(api, 'getProducts').mockResolvedValue(MOCK_PRODUCTS);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual(MOCK_PRODUCTS);
    expect(result.current.error).toBeNull();
  });

  it('sets error and loading: false when the fetch fails', async () => {
    vi.spyOn(api, 'getProducts').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network error');
    expect(result.current.products).toEqual([]);
  });
});
