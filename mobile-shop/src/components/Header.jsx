import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export function Header() {
  const { cartCount, pageTitle } = useContext(CartContext);

  return (
    <header className="header">
      <div className="shell header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
        </Link>

        <nav className="crumbs" aria-label="Breadcrumb">
          {pageTitle ? (
            <>
              <Link to="/" className="crumbs-link">Catalog</Link>
              <span className="crumb-sep" aria-hidden="true">/</span>
              <span className="crumb-current">{pageTitle}</span>
            </>
          ) : (
            <span className="crumb-current">Catalog</span>
          )}
        </nav>

        <span className="cart" aria-label={`Cart, ${cartCount} items`}>
          <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h2l2.5 11.5a2 2 0 0 0 2 1.5h7a2 2 0 0 0 2-1.5L21 9H6" />
            <circle cx="10" cy="21" r="1" />
            <circle cx="17" cy="21" r="1" />
          </svg>
          <span>Cart</span>
          <span className={`cart-count${cartCount === 0 ? ' is-zero' : ''}`}>{cartCount}</span>
        </span>
      </div>
    </header>
  );
}
