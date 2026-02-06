import { describe, it, expect } from 'vitest';
import { calculateTopicProgress } from '@/lib/progression';
import type { StudentStats } from '@shared/types';

describe('Progression Logic', () => {
  const mockStats = (score: number): StudentStats => ({
    id: 'user1',
    totalScore: score,
    streak: 0,
    highScore: 0,
    totalSolved: 0,
    lastSolvedAt: 0,
    difficulty: 'easy',
    sessionLogs: []
  });

  it('unlocks addition by default', () => {
    const topics = calculateTopicProgress(null);
    const addition = topics.find(t => t.id === 'addition');
    expect(addition?.isUnlocked).toBe(true);
  });

  it('unlocks subtraction when addition reaches threshold', () => {
    // Threshold is 80. Addition progress is totalScore (capped at 100).
    const topics = calculateTopicProgress(mockStats(80));
    const subtraction = topics.find(t => t.id === 'subtraction');
    expect(subtraction?.isUnlocked).toBe(true);
  });

  it('keeps subtraction locked below threshold', () => {
    const topics = calculateTopicProgress(mockStats(79));
    const subtraction = topics.find(t => t.id === 'subtraction');
    expect(subtraction?.isUnlocked).toBe(false);
  });

  it('unlocks multiplication when subtraction reaches threshold', () => {
    // subtractionProgress = totalScore - 100
    // To reach 80% subtraction, totalScore must be 180.
    const topics = calculateTopicProgress(mockStats(180));
    const subtraction = topics.find(t => t.id === 'subtraction');
    const multiplication = topics.find(t => t.id === 'multiplication');

    expect(subtraction?.progress).toBe(80);
    expect(multiplication?.isUnlocked).toBe(true);
  });

  it('unlocks division when multiplication reaches threshold', () => {
    // multiplicationProgress = totalScore - 200
    // To reach 80% multiplication, totalScore must be 280.
    const topics = calculateTopicProgress(mockStats(280));
    const multiplication = topics.find(t => t.id === 'multiplication');
    const division = topics.find(t => t.id === 'division');

    expect(multiplication?.progress).toBe(80);
    expect(division?.isUnlocked).toBe(true);
  });
});
