export function ProductCard({ product, onClick }) {
  return (
    <article
      className="card"
      onClick={onClick}
      tabIndex={0}
      role="link"
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`${product.brand} ${product.model}, €${product.price}`}
    >
      <div className="card-image">
        {product.imgUrl ? (
          <img
            src={product.imgUrl}
            alt={`${product.brand} ${product.model}`}
            className="card-img"
            loading="lazy"
          />
        ) : (
          <div className="ph" />
        )}
      </div>
      <div className="card-meta">
        <div className="card-brand">{product.brand}</div>
        <div className="card-model">{product.model}</div>
        <div className="card-price mono">
          €{Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      <div className="card-cta" aria-hidden="true">View →</div>
    </article>
  );
}
