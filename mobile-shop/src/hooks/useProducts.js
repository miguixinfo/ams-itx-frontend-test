import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message ?? 'Error loading products'))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
