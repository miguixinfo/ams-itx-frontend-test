import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from '../../components/SearchBar';

describe('SearchBar', () => {
  it('renders the search input', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('calls onChange when the user types', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    await userEvent.type(screen.getByRole('searchbox'), 'a');

    expect(onChange).toHaveBeenCalled();
  });

  it('shows the clear button when value is non-empty', () => {
    render(<SearchBar value="Nimbus" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('hides the clear button when value is empty', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('calls onChange with an empty string when the clear button is clicked', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="Nimbus" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: /clear/i }));

    expect(onChange).toHaveBeenCalledWith('');
  });
});
