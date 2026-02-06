import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { SpeedDrillPage } from '@/pages/math/SpeedDrillPage';

describe('Speed Drill', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates 20 random problems', () => {
    render(<SpeedDrillPage />);
    
    expect(screen.getByText(/problems: 1\/20/i)).toBeInTheDocument();
  });

  it('advances to next problem on correct answer', async () => {
    const user = userEvent.setup();
    render(<SpeedDrillPage />);

    // Get current problem
    const problemText = screen.getByText(/\d+ \+ \d+ = \?/);
    const [num1, num2] = problemText.textContent!.match(/\d+/g)!.map(Number);
    const answer = num1 + num2;

    // Type answer
    const input = screen.getByRole('textbox');
    await user.type(input, answer.toString());

    // Should advance to problem 2
    await waitFor(() => {
      expect(screen.getByText(/problems: 2\/20/i)).toBeInTheDocument();
    });
  });

  it('tracks time accurately', async () => {
    render(<SpeedDrillPage />);
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Timer should show ~2 seconds
    expect(screen.getByText(/timer: 2\.\d+s/i)).toBeInTheDocument();
  });

  it('completes drill and shows results', async () => {
    const user = userEvent.setup();
    render(<SpeedDrillPage />);

    // Answer all 20 problems
    for (let i = 0; i < 20; i++) {
      const problemText = screen.getByText(/\d+ \+ \d+ = \?/);
      const [num1, num2] = problemText.textContent!.match(/\d+/g)!.map(Number);
      const answer = num1 + num2;

      const input = screen.getByRole('textbox');
      await user.type(input, answer.toString());
      
      if (i < 19) {
        await waitFor(() => {
          expect(screen.getByText(new RegExp(`problems: ${i + 2}/20`, 'i'))).toBeInTheDocument();
        });
      }
    }

    // Should show results screen
    await waitFor(() => {
      expect(screen.getByText(/challenge complete/i)).toBeInTheDocument();
      expect(screen.getByText(/total time/i)).toBeInTheDocument();
      expect(screen.getByText(/accuracy: 100%/i)).toBeInTheDocument();
    });
  });
});
