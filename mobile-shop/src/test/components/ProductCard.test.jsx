import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '../../components/ProductCard';

const BASE_PRODUCT = {
  id: 'ZG001',
  brand: 'Nimbus',
  model: 'Aero 14 Pro',
  price: 949,
  imgUrl: 'https://example.com/phone.jpg',
};

describe('ProductCard', () => {
  it('renders the product id, brand, model, and formatted price', () => {
    render(<ProductCard product={BASE_PRODUCT} onClick={() => {}} />);

    expect(screen.getByText('ZG001')).toBeInTheDocument();
    expect(screen.getByText('Nimbus')).toBeInTheDocument();
    expect(screen.getByText('Aero 14 Pro')).toBeInTheDocument();
    expect(screen.getByText(/949/)).toBeInTheDocument();
  });

  it('renders an img with the correct src when imgUrl is provided', () => {
    render(<ProductCard product={BASE_PRODUCT} onClick={() => {}} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', BASE_PRODUCT.imgUrl);
  });

  it('renders the phone placeholder when imgUrl is absent', () => {
    const product = { ...BASE_PRODUCT, imgUrl: undefined };
    const { container } = render(<ProductCard product={product} onClick={() => {}} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('.ph')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', async () => {
    const onClick = vi.fn();
    render(<ProductCard product={BASE_PRODUCT} onClick={onClick} />);

    await userEvent.click(screen.getByRole('link'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('calls onClick when Enter is pressed on the card', async () => {
    const onClick = vi.fn();
    render(<ProductCard product={BASE_PRODUCT} onClick={onClick} />);

    screen.getByRole('link').focus();
    await userEvent.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledOnce();
  });
});
