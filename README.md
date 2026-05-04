# Mobile Shop — Frontend Test

A mobile-device shop SPA built as a frontend technical test. Implements a product listing page (PLP) and a product detail page (PDP) with cart functionality, consuming the provided REST API.

## Stack

| Layer | Technology |
|---|---|
| UI | React 19 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Build | Vite 8 |
| Testing | Vitest + Testing Library |
| Linting | ESLint + Prettier |

## Features

- **PLP** — product grid with real-time search filtering by brand or model; skeleton loading state; error state
- **PDP** — product image, full spec table, color/storage selectors, add-to-cart action
- **Cart counter** — persisted in `localStorage`, updated on every successful add-to-cart API call
- **API cache** — product list and individual products are cached in `localStorage` with a 1-hour TTL to avoid redundant requests
- **Breadcrumb** — header automatically reflects current page context (Catalog vs product model name)

## Project structure

```
src/
├── components/
│   ├── Header.jsx          # Top nav: brand logo, breadcrumb, cart counter
│   ├── PLP.jsx             # Product listing page
│   ├── PDP.jsx             # Product detail page
│   ├── ProductCard.jsx     # Single card in the grid
│   ├── SearchBar.jsx       # Controlled search input
│   └── SkeletonGrid.jsx    # Placeholder grid shown while loading
├── context/
│   └── CartContext.jsx     # Global cart count + dynamic page title
├── hooks/
│   ├── useProducts.js      # Fetch + cache product list
│   └── useProductDetail.js # Fetch + cache single product (cancellable)
├── services/
│   └── api.js              # Fetch wrappers with localStorage cache layer
└── test/                   # Unit tests mirroring src structure
```

## Getting started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Testing

```bash
# Run tests in watch mode
npm test

# Single run with coverage report
npm run coverage
```

Tests use `jsdom` as environment and `@testing-library/react` for component assertions. API calls are always mocked at the module level.

## Linting

```bash
npm run lint
```

ESLint is configured with `eslint-config-prettier` so formatting is handled exclusively by Prettier. The script runs with `--max-warnings 0`.

## API

Base URL: `https://itx-frontend-test.onrender.com`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/product` | List all products |
| `GET` | `/api/product/:id` | Get product detail by ID |
| `POST` | `/api/cart` | Add item to cart — body: `{ id, colorCode, storageCode }` — returns `{ count }` |

Both `GET` endpoints are cached client-side in `localStorage` for 1 hour. Stale or malformed cache entries are silently discarded.
