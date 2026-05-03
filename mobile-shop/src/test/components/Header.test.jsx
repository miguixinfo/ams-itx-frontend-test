import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '../../components/Header';

describe('Header', () => {
  it('renders the brand mark element', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('.brand-mark')).toBeInTheDocument();
  });

  it('renders the Catalog breadcrumb', () => {
    render(<Header />);
    expect(screen.getByText('Catalog')).toBeInTheDocument();
  });

  it('renders the cart link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
  });

  it('renders the cart count as zero', () => {
    render(<Header />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
