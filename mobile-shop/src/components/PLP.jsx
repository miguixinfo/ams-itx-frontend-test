import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { SearchBar } from './SearchBar';
import { ProductCard } from './ProductCard';
import { SkeletonGrid } from './SkeletonGrid';

export function PLP() {
  const { products, loading, error } = useProducts();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <main>
      <div className="shell">
        <section className="plp-top">
          <h1 className="plp-title">
            Mobiles
          </h1>
          <div className="plp-meta">
            FW 2026 · {loading ? 'LOADING…' : `${products.length} REFS`}
          </div>
        </section>
        <SearchBar value={query} onChange={setQuery} />
        <div className="results-meta">
          <span>
            {loading ? '—' : `${filtered.length} RESULT${filtered.length !== 1 ? 'S' : ''}`}
          </span>
          <span>Sorted by relevance</span>
        </div>
      </div>

      <div className="shell">
        {error ? (
          <div className="empty">
            <h3>Failed to load products</h3>
            <p>{error}</p>
          </div>
        ) : loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="empty">
            <h3>No matches for &ldquo;{query}&rdquo;</h3>
            <p>Try a different brand or model name.</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <div className="shell">
        <footer className="footer">
          <span>Mobile Shop · Frontend Test</span>
          <span>Data cached · 1h TTL</span>
        </footer>
      </div>
    </main>
  );
}
