import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProductDetail } from '../../hooks/useProductDetail';
import * as api from '../../services/api';

const MOCK_PRODUCT = {
  id: 'ZG001',
  brand: 'Nimbus',
  model: 'Aero 14 Pro',
  price: '949.00',
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [{ code: 2000, name: '64 GB' }],
  },
};

describe('useProductDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with loading: true, product: null, error: null', () => {
    vi.spyOn(api, 'getProductById').mockResolvedValue(MOCK_PRODUCT);
    const { result } = renderHook(() => useProductDetail('ZG001'));
    expect(result.current.loading).toBe(true);
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('sets product and loading: false after a successful fetch', async () => {
    vi.spyOn(api, 'getProductById').mockResolvedValue(MOCK_PRODUCT);
    const { result } = renderHook(() => useProductDetail('ZG001'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.product).toEqual(MOCK_PRODUCT);
    expect(result.current.error).toBeNull();
  });

  it('sets error and loading: false when the fetch fails', async () => {
    vi.spyOn(api, 'getProductById').mockRejectedValue(new Error('Not found'));
    const { result } = renderHook(() => useProductDetail('ZG001'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Not found');
    expect(result.current.product).toBeNull();
  });

  it('calls getProductById with the provided id', async () => {
    const spy = vi.spyOn(api, 'getProductById').mockResolvedValue(MOCK_PRODUCT);
    renderHook(() => useProductDetail('ZG001'));
    await waitFor(() => expect(spy).toHaveBeenCalledWith('ZG001'));
  });

  it('resets to loading and refetches when the id changes', async () => {
    const spy = vi.spyOn(api, 'getProductById').mockResolvedValue(MOCK_PRODUCT);
    const { result, rerender } = renderHook(({ id }) => useProductDetail(id), {
      initialProps: { id: 'ZG001' },
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ id: 'ZG002' });
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('ZG002');
  });
});
