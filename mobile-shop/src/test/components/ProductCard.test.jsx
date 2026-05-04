import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard';

const BASE_PRODUCT = {
  id: 'ZG001',
  brand: 'Nimbus',
  model: 'Aero 14 Pro',
  price: 949,
  imgUrl: 'https://example.com/phone.jpg',
};

function renderCard(product = BASE_PRODUCT) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );
}

describe('ProductCard', () => {
  it('links to the product detail page', () => {
    renderCard();
    expect(screen.getByRole('link')).toHaveAttribute('href', `/product/${BASE_PRODUCT.id}`);
  });

  it('renders the product brand, model, and formatted price', () => {
    renderCard();
    expect(screen.getByText('Nimbus')).toBeInTheDocument();
    expect(screen.getByText('Aero 14 Pro')).toBeInTheDocument();
    expect(screen.getByText(/949/)).toBeInTheDocument();
  });

  it('renders an img with the correct src when imgUrl is provided', () => {
    renderCard();
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', BASE_PRODUCT.imgUrl);
  });

  it('renders the phone placeholder when imgUrl is absent', () => {
    const { container } = renderCard({ ...BASE_PRODUCT, imgUrl: undefined });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('.ph')).toBeInTheDocument();
  });
});
