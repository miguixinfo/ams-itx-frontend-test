import { useReducer, useEffect } from 'react';
import { getProductById } from '../services/api';

const initialState = { product: null, loading: true, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'start':   return { product: null, loading: true, error: null };
    case 'success': return { product: action.data, loading: false, error: null };
    case 'error':   return { product: null, loading: false, error: action.error };
    default:        return state;
  }
}

export function useProductDetail(id) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    dispatch({ type: 'start' });

    getProductById(id)
      .then((data) => { if (!cancelled) dispatch({ type: 'success', data }); })
      .catch((err) => { if (!cancelled) dispatch({ type: 'error', error: err.message }); });

    return () => { cancelled = true; };
  }, [id]);

  return state;
}
