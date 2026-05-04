import { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useProductDetail } from '../hooks/useProductDetail';
import { addToCart } from '../services/api';

const SPECS = [
  ['Brand', 'brand'],
  ['Model', 'model'],
  ['CPU', 'cpu'],
  ['RAM', 'ram'],
  ['OS', 'os'],
  ['Display', 'displayResolution'],
  ['Battery', 'battery'],
  ['Main camera', 'primaryCamera'],
  ['Front camera', 'secondaryCmera'],
  ['Dimensions', 'dimentions'],
  ['Weight', 'weight'],
];

function formatSpecValue(val) {
  if (Array.isArray(val)) return val.join(', ');
  return val;
}

function PDPSkeleton() {
  return (
    <main>
      <div className="shell">
        <span className="pdp-back">← Back to catalog</span>
        <section className="pdp">
          <div className="pdp-image-wrap">
            <div className="ph" />
          </div>
          <div className="pdp-info">
            <div className="skeleton-line" style={{ width: 80, marginBottom: 16 }} />
            <div className="skeleton-line" style={{ width: 280, height: 36, marginBottom: 24 }} />
            <div className="skeleton-line" style={{ width: 120, height: 24 }} />
          </div>
        </section>
      </div>
    </main>
  );
}

export function PDP() {
  const { id } = useParams();
  const { product, loading, error } = useProductDetail(id);
  const { setCartCount, setPageTitle } = useContext(CartContext);

  const [colorCode, setColorCode] = useState('');
  const [storageCode, setStorageCode] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    if (product.options?.colors?.length === 1) setColorCode(String(product.options.colors[0].code));
    if (product.options?.storages?.length === 1) setStorageCode(String(product.options.storages[0].code));
  }, [product]);

  useEffect(() => {
    if (product) setPageTitle(product.model);
    return () => setPageTitle(null);
  }, [product, setPageTitle]);

  async function handleAddToCart() {
    if (adding || !colorCode || !storageCode) return;
    setAdding(true);
    try {
      const res = await addToCart({
        id,
        colorCode: Number(colorCode),
        storageCode: Number(storageCode),
      });
      setCartCount(res.count);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // silent — button re-enables automatically
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <PDPSkeleton />;

  if (error) {
    return (
      <main>
        <div className="shell">
          <div className="empty" style={{ paddingTop: 80 }}>
            <h3>Failed to load product</h3>
            <p>{error}</p>
            <Link to="/" className="pdp-back" style={{ display: 'inline-flex', marginTop: 24 }}>
              ← Back to catalog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const canAdd = colorCode !== '' && storageCode !== '';

  return (
    <main>
      <div className="shell">
        <Link to="/" className="pdp-back">← Back to catalog</Link>

        <section className="pdp">
          <div className="pdp-image-wrap">
            {product.imgUrl ? (
              <img
                src={product.imgUrl}
                alt={`${product.brand} ${product.model}`}
                className="pdp-img"
              />
            ) : (
              <div className="ph" />
            )}
          </div>

          <div className="pdp-info">
            <div className="pdp-brand">{product.brand}</div>
            <h1 className="pdp-model">{product.model}</h1>

            <div className="pdp-price-row">
              <span className="pdp-price mono">
                €{Number(product.price).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="pdp-price-note">VAT incl.</span>
            </div>

            <div className="actions">
              <div className="selector">
                <label className="selector-label" htmlFor="pdp-color">Color</label>
                <select
                  id="pdp-color"
                  className="pdp-select"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                >
                  {product.options?.colors?.length !== 1 && (
                    <option value="">Select color…</option>
                  )}
                  {product.options?.colors?.map((c) => (
                    <option key={c.code} value={String(c.code)}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="selector">
                <label className="selector-label" htmlFor="pdp-storage">Storage</label>
                <select
                  id="pdp-storage"
                  className="pdp-select"
                  value={storageCode}
                  onChange={(e) => setStorageCode(e.target.value)}
                >
                  {product.options?.storages?.length !== 1 && (
                    <option value="">Select storage…</option>
                  )}
                  {product.options?.storages?.map((s) => (
                    <option key={s.code} value={String(s.code)}>{s.name}</option>
                  ))}
                </select>
              </div>

              <button
                className="add-btn"
                onClick={handleAddToCart}
                disabled={!canAdd || adding}
              >
                {added ? 'Added!' : adding ? 'Adding…' : 'Add to cart'}
              </button>
            </div>

            <div className="specs">
              <h3>Full specifications</h3>
              <div className="specs-table">
                {SPECS.map(([label, key]) => {
                  const val = product[key];
                  if (val == null || val === '') return null;
                  return (
                    <div key={key} className="spec-row">
                      <div className="spec-key">{label}</div>
                      <div className="spec-val">{formatSpecValue(val)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <span>Mobile Shop · Frontend Test</span>
          <span>REF {product.id}</span>
        </footer>
      </div>
    </main>
  );
}
