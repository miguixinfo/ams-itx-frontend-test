export function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by brand or model…"
        aria-label="Search products"
        autoFocus
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
          Clear
        </button>
      )}
    </div>
  );
}
