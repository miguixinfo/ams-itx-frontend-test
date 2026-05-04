import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(() => {
    const stored = localStorage.getItem('cart_count');
    return stored ? Number(stored) : 0;
  });
  const [pageTitle, setPageTitle] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart_count', String(cartCount));
  }, [cartCount]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, pageTitle, setPageTitle }}>
      {children}
    </CartContext.Provider>
  );
}
