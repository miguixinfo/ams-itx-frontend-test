import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonGrid } from '../../components/SkeletonGrid';

describe('SkeletonGrid', () => {
  it('renders exactly 8 skeleton cards', () => {
    const { container } = render(<SkeletonGrid />);
    expect(container.querySelectorAll('.card')).toHaveLength(8);
  });

  it('marks the grid as aria-busy while loading', () => {
    const { container } = render(<SkeletonGrid />);
    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
  });

  it('provides an accessible label for assistive technology', () => {
    const { container } = render(<SkeletonGrid />);
    expect(container.firstChild).toHaveAttribute('aria-label', 'Loading products');
  });
});
