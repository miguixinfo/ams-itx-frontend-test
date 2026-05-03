export function SkeletonGrid() {
  return (
    <div className="grid skeleton-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, i) => (
        <article key={i} className="card">
          <div className="skeleton-line" style={{ width: 60, height: 10 }} />
          <div className="card-image">
            <div className="ph" style={{ opacity: 0.4 }} />
          </div>
          <div className="card-meta">
            <div className="skeleton-line" style={{ width: 70, marginBottom: 8 }} />
            <div className="skeleton-line" style={{ width: 140, height: 16, marginBottom: 8 }} />
            <div className="skeleton-line" style={{ width: 80 }} />
          </div>
        </article>
      ))}
    </div>
  );
}
