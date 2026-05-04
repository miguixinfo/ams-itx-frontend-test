import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import { PDP } from '../../components/PDP';
import * as useProductDetailModule from '../../hooks/useProductDetail';
import * as api from '../../services/api';

const MOCK_PRODUCT = {
  id: 'ZG001',
  brand: 'Nimbus',
  model: 'Aero 14 Pro',
  price: '949.00',
  imgUrl: 'https://example.com/phone.jpg',
  cpu: 'Snapdragon 8 Gen 3',
  ram: '12 GB',
  os: 'Android 14',
  displayResolution: '2340x1080',
  battery: '5000 mAh',
  primaryCamera: ['108 MP'],
  secondaryCmera: ['12 MP'],
  dimentions: '160 x 75 x 8 mm',
  weight: '195 g',
  options: {
    colors: [
      { code: 1000, name: 'Black' },
      { code: 1001, name: 'Silver' },
    ],
    storages: [
      { code: 2000, name: '16 GB' },
      { code: 2001, name: '32 GB' },
    ],
  },
};

function mockHook(overrides = {}) {
  vi.spyOn(useProductDetailModule, 'useProductDetail').mockReturnValue({
    product: null,
    loading: true,
    error: null,
    ...overrides,
  });
}

function renderPDP(productId = 'ZG001') {
  return render(
    <CartProvider>
      <MemoryRouter initialEntries={[`/product/${productId}`]}>
        <Routes>
          <Route path="/product/:id" element={<PDP />} />
          <Route path="/" element={<div>Catalog page</div>} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );
}

describe('PDP', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // --- Loading state ---

  it('shows the image placeholder skeleton while loading', () => {
    mockHook({ loading: true });
    const { container } = renderPDP();
    expect(container.querySelector('.pdp-image-wrap')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-line')).toBeInTheDocument();
  });

  // --- Error state ---

  it('shows an error message and a back link when loading fails', () => {
    mockHook({ loading: false, error: 'API error: 404' });
    renderPDP();
    expect(screen.getByText(/failed to load product/i)).toBeInTheDocument();
    expect(screen.getByText('API error: 404')).toBeInTheDocument();
    expect(screen.getByText(/back to catalog/i)).toBeInTheDocument();
  });

  // --- Product info ---

  it('renders brand, model and formatted price', () => {
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();
    // "Nimbus" appears in both .pdp-brand and the specs Brand row
    expect(screen.getByText('Nimbus', { selector: '.pdp-brand' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aero 14 Pro' })).toBeInTheDocument();
    expect(screen.getByText(/949\.00/)).toBeInTheDocument();
  });

  it('renders the product image when imgUrl is provided', () => {
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();
    expect(screen.getByRole('img')).toHaveAttribute('src', MOCK_PRODUCT.imgUrl);
  });

  it('renders the placeholder when imgUrl is absent', () => {
    mockHook({ loading: false, product: { ...MOCK_PRODUCT, imgUrl: '' } });
    const { container } = renderPDP();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('.pdp-image-wrap .ph')).toBeInTheDocument();
  });

  // --- Specs table ---

  it('renders spec rows with product data', () => {
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();
    expect(screen.getByText('Snapdragon 8 Gen 3')).toBeInTheDocument();
    expect(screen.getByText('Android 14')).toBeInTheDocument();
    expect(screen.getByText('5000 mAh')).toBeInTheDocument();
  });

  // --- Selects ---

  it('renders color options from product.options.colors', () => {
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();
    expect(screen.getByRole('option', { name: 'Black' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Silver' })).toBeInTheDocument();
  });

  it('renders storage options from product.options.storages', () => {
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();
    expect(screen.getByRole('option', { name: '16 GB' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '32 GB' })).toBeInTheDocument();
  });

  it('auto-selects color when only one option is available', () => {
    const product = {
      ...MOCK_PRODUCT,
      options: { ...MOCK_PRODUCT.options, colors: [{ code: 1000, name: 'Black' }] },
    };
    mockHook({ loading: false, product });
    renderPDP();
    expect(screen.getByLabelText('Color')).toHaveValue('1000');
  });

  it('auto-selects storage when only one option is available', () => {
    const product = {
      ...MOCK_PRODUCT,
      options: { ...MOCK_PRODUCT.options, storages: [{ code: 2000, name: '16 GB' }] },
    };
    mockHook({ loading: false, product });
    renderPDP();
    expect(screen.getByLabelText('Storage')).toHaveValue('2000');
  });

  // --- Add to cart button ---

  it('disables the button until both color and storage are selected', () => {
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });

  it('enables the button once both selects have a value', async () => {
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();
    await userEvent.selectOptions(screen.getByLabelText('Color'), '1000');
    await userEvent.selectOptions(screen.getByLabelText('Storage'), '2000');
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeEnabled();
  });

  it('calls addToCart with the correct id, colorCode and storageCode', async () => {
    const spy = vi.spyOn(api, 'addToCart').mockResolvedValue({ count: 1 });
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP('ZG001');
    await userEvent.selectOptions(screen.getByLabelText('Color'), '1000');
    await userEvent.selectOptions(screen.getByLabelText('Storage'), '2000');
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(spy).toHaveBeenCalledWith({ id: 'ZG001', colorCode: 1000, storageCode: 2000 });
  });

  it('shows "Added!" feedback after a successful add to cart', async () => {
    vi.spyOn(api, 'addToCart').mockResolvedValue({ count: 1 });
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();
    await userEvent.selectOptions(screen.getByLabelText('Color'), '1000');
    await userEvent.selectOptions(screen.getByLabelText('Storage'), '2000');
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.getByRole('button', { name: /added!/i })).toBeInTheDocument();
  });

  it('"Added!" resets to "Add to cart" after 2 seconds', async () => {
    vi.useFakeTimers();
    vi.spyOn(api, 'addToCart').mockResolvedValue({ count: 1 });
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();

    // Use fireEvent to avoid userEvent/fake-timer conflicts
    act(() => {
      fireEvent.change(screen.getByLabelText('Color'), { target: { value: '1000' } });
      fireEvent.change(screen.getByLabelText('Storage'), { target: { value: '2000' } });
    });

    // Click and flush the async addToCart promise within act
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    });

    expect(screen.getByRole('button', { name: /added!/i })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2001));

    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('updates the cart count in context after a successful add', async () => {
    vi.spyOn(api, 'addToCart').mockResolvedValue({ count: 3 });
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();
    await userEvent.selectOptions(screen.getByLabelText('Color'), '1000');
    await userEvent.selectOptions(screen.getByLabelText('Storage'), '2000');
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(localStorage.getItem('cart_count')).toBe('3');
  });

  // --- Navigation ---

  it('navigates back to the catalog when the back link is clicked', async () => {
    mockHook({ loading: false, product: MOCK_PRODUCT });
    renderPDP();
    await userEvent.click(screen.getByText(/back to catalog/i));
    expect(screen.getByText('Catalog page')).toBeInTheDocument();
  });
});
