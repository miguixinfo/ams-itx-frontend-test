import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PLP } from '../../components/PLP';
import * as useProductsModule from '../../hooks/useProducts';

const PRODUCTS = [
  { id: 'ZG001', brand: 'Nimbus', model: 'Aero 14 Pro', price: 949, imgUrl: '' },
  { id: 'ZG002', brand: 'Korvex', model: 'Pulse X', price: 599, imgUrl: '' },
  { id: 'ZG003', brand: 'Nimbus', model: 'Aero 14', price: 749, imgUrl: '' },
];

function mockHook(overrides = {}) {
  vi.spyOn(useProductsModule, 'useProducts').mockReturnValue({
    products: [],
    loading: true,
    error: null,
    ...overrides,
  });
}

describe('PLP', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the skeleton grid while loading', () => {
    mockHook({ loading: true });
    const { container } = render(<PLP />);
    expect(container.querySelector('.skeleton-grid')).toBeInTheDocument();
  });

  it('shows all products after loading', () => {
    mockHook({ loading: false, products: PRODUCTS });
    render(<PLP />);
    expect(screen.getByText('Aero 14 Pro')).toBeInTheDocument();
    expect(screen.getByText('Pulse X')).toBeInTheDocument();
    expect(screen.getByText('Aero 14')).toBeInTheDocument();
  });

  it('displays the correct total result count', () => {
    mockHook({ loading: false, products: PRODUCTS });
    render(<PLP />);
    expect(screen.getByText('3 RESULTS')).toBeInTheDocument();
  });

  it('filters products by brand in real time', async () => {
    mockHook({ loading: false, products: PRODUCTS });
    render(<PLP />);

    await userEvent.type(screen.getByRole('searchbox'), 'Korvex');

    expect(screen.getByText('Pulse X')).toBeInTheDocument();
    expect(screen.queryByText('Aero 14 Pro')).not.toBeInTheDocument();
  });

  it('filters products by model in real time', async () => {
    mockHook({ loading: false, products: PRODUCTS });
    render(<PLP />);

    await userEvent.type(screen.getByRole('searchbox'), 'Pulse');

    expect(screen.getByText('Pulse X')).toBeInTheDocument();
    expect(screen.queryByText('Aero 14 Pro')).not.toBeInTheDocument();
  });

  it('updates the result counter when filtering', async () => {
    mockHook({ loading: false, products: PRODUCTS });
    render(<PLP />);

    await userEvent.type(screen.getByRole('searchbox'), 'Nimbus');

    expect(screen.getByText('2 RESULTS')).toBeInTheDocument();
  });

  it('uses singular RESULT when exactly one product matches', async () => {
    mockHook({ loading: false, products: PRODUCTS });
    render(<PLP />);

    await userEvent.type(screen.getByRole('searchbox'), 'Pulse X');

    expect(screen.getByText('1 RESULT')).toBeInTheDocument();
  });

  it('shows an empty state when no products match the query', async () => {
    mockHook({ loading: false, products: PRODUCTS });
    render(<PLP />);

    await userEvent.type(screen.getByRole('searchbox'), 'zzznomatch');

    expect(screen.getByText(/no matches/i)).toBeInTheDocument();
  });

  it('shows the error state when loading fails', () => {
    mockHook({ loading: false, error: 'API error: 500' });
    render(<PLP />);
    expect(screen.getByText(/failed to load products/i)).toBeInTheDocument();
    expect(screen.getByText('API error: 500')).toBeInTheDocument();
  });
});
