import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import { Header } from '../../components/Header';

function renderHeader() {
  return render(
    <CartProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </CartProvider>
  );
}

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the brand mark element', () => {
    const { container } = renderHeader();
    expect(container.querySelector('.brand-mark')).toBeInTheDocument();
  });

  it('renders the Catalog breadcrumb by default', () => {
    renderHeader();
    expect(screen.getByText('Catalog')).toBeInTheDocument();
  });

  it('renders the cart element with aria-label', () => {
    renderHeader();
    expect(screen.getByLabelText(/cart, 0 items/i)).toBeInTheDocument();
  });

  it('renders the cart count as 0 when localStorage is empty', () => {
    renderHeader();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('reads and displays the initial cart count from localStorage', () => {
    localStorage.setItem('cart_count', '4');
    renderHeader();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('applies is-zero class to the count badge when cartCount is 0', () => {
    const { container } = renderHeader();
    expect(container.querySelector('.cart-count')).toHaveClass('is-zero');
  });

  it('removes the is-zero class when cartCount is greater than 0', () => {
    localStorage.setItem('cart_count', '2');
    const { container } = renderHeader();
    expect(container.querySelector('.cart-count')).not.toHaveClass('is-zero');
  });
});
