import { describe, it, expect } from 'vitest';
import { calculateTopicProgress } from '../lib/progression';
import { TOPIC_UNLOCK_THRESHOLD } from '../../shared/math-config';

describe('Sequential Unlock Logic', () => {
  it('should keep Multiplication locked if Subtraction is below threshold', () => {
    const mockStats = {
      totalScore: 150, // Subtraction starts at 100, so this is 50 points into Subtraction (50%)
    } as any;

    const topics = calculateTopicProgress(mockStats);
    const subtraction = topics.find(t => t.id === 'subtraction');
    const multiplication = topics.find(t => t.id === 'multiplication');

    expect(subtraction?.progress).toBe(50);
    expect(multiplication?.isUnlocked).toBe(false);
  });

  it('should unlock Multiplication if Subtraction is above threshold', () => {
    const mockStats = {
      totalScore: 180, // Subtraction starts at 100, so this is 80 points (80%)
    } as any;

    const topics = calculateTopicProgress(mockStats);
    const subtraction = topics.find(t => t.id === 'subtraction');
    const multiplication = topics.find(t => t.id === 'multiplication');

    expect(subtraction?.progress).toBe(80);
    expect(multiplication?.isUnlocked).toBe(true);
  });
});
