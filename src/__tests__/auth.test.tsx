import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { LoginPage } from '@/pages/LoginPage';

describe('Authentication', () => {
  it('renders login form with username input', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it('renders login form with PIN input', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText(/^pin$/i)).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('button', { name: /let's go/i })).toBeInTheDocument();
  });

  it('renders welcome message', () => {
    render(<LoginPage />);
    
    expect(screen.getByText(/math adventure/i)).toBeInTheDocument();
  });
});
