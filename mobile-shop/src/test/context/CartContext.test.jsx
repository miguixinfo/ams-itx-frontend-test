import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { useContext } from 'react';
import { CartContext, CartProvider } from '../../context/CartContext';

function Consumer() {
  const { cartCount, setCartCount, pageTitle, setPageTitle } = useContext(CartContext);
  return (
    <div>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="title">{pageTitle ?? 'null'}</span>
      <button onClick={() => setCartCount(5)}>set5</button>
      <button onClick={() => setPageTitle('My Model')}>setTitle</button>
      <button onClick={() => setPageTitle(null)}>clearTitle</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <CartProvider>
      <Consumer />
    </CartProvider>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults cartCount to 0 when localStorage is empty', () => {
    renderWithProvider();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('reads the initial cartCount from localStorage', () => {
    localStorage.setItem('cart_count', '7');
    renderWithProvider();
    expect(screen.getByTestId('count')).toHaveTextContent('7');
  });

  it('updates cartCount in the UI', async () => {
    renderWithProvider();
    await userEvent.click(screen.getByText('set5'));
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });

  it('persists cartCount changes to localStorage', async () => {
    renderWithProvider();
    await userEvent.click(screen.getByText('set5'));
    expect(localStorage.getItem('cart_count')).toBe('5');
  });

  it('defaults pageTitle to null', () => {
    renderWithProvider();
    expect(screen.getByTestId('title')).toHaveTextContent('null');
  });

  it('updates pageTitle when setPageTitle is called', async () => {
    renderWithProvider();
    await userEvent.click(screen.getByText('setTitle'));
    expect(screen.getByTestId('title')).toHaveTextContent('My Model');
  });

  it('clears pageTitle when set to null', async () => {
    renderWithProvider();
    await userEvent.click(screen.getByText('setTitle'));
    await userEvent.click(screen.getByText('clearTitle'));
    expect(screen.getByTestId('title')).toHaveTextContent('null');
  });
});
