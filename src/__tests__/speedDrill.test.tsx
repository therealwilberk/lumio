import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import { SpeedDrillPage } from '@/pages/math/SpeedDrillPage';

describe('Speed Drill', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders speed drill page', () => {
    render(<SpeedDrillPage />);
    
    // Check for the main title
    expect(screen.getByText(/lightning round/i)).toBeInTheDocument();
  });

  it('shows start button', () => {
    render(<SpeedDrillPage />);
    
    // Check for start button (getAllByRole because there may be multiple buttons with "start")
    const startButtons = screen.getAllByRole('button', { name: /start/i });
    expect(startButtons.length).toBeGreaterThan(0);
  });

  it('shows back button', () => {
    render(<SpeedDrillPage />);
    
    // Check for back button
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });
});
