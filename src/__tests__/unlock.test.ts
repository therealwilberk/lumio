import { describe, it, expect } from 'vitest';
import { calculateTopicProgress } from '../lib/progression';

describe('Sequential Unlock Logic', () => {
  it('should keep Multiplication locked if Subtraction achievement is missing', () => {
    const mockStats = {
      totalScore: 150,
      topicScores: {
        addition: 100,
        subtraction: 50
      },
      achievements: ['addition-master']
    } as any;

    const topics = calculateTopicProgress(mockStats);
    const subtraction = topics.find(t => t.id === 'subtraction');
    const multiplication = topics.find(t => t.id === 'multiplication');

    expect(subtraction?.progress).toBe(50);
    expect(multiplication?.isUnlocked).toBe(false);
  });

  it('should unlock Multiplication if Subtraction achievement is present', () => {
    const mockStats = {
      totalScore: 180,
      topicScores: {
        addition: 100,
        subtraction: 80
      },
      achievements: ['addition-master', 'subtraction-master']
    } as any;

    const topics = calculateTopicProgress(mockStats);
    const subtraction = topics.find(t => t.id === 'subtraction');
    const multiplication = topics.find(t => t.id === 'multiplication');

    expect(subtraction?.progress).toBe(80);
    expect(multiplication?.isUnlocked).toBe(true);
  });
});
