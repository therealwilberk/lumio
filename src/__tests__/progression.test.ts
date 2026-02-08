import { describe, it, expect } from 'vitest';
import { calculateTopicProgress } from '@/lib/progression';
import type { StudentStats } from '@shared/types';

describe('Progression Logic', () => {
  const mockStats = (topicScores: Record<string, number>): StudentStats => ({
    id: 'user1',
    totalScore: Object.values(topicScores).reduce((a, b) => a + b, 0),
    topicScores,
    streak: 0,
    highScore: 0,
    totalSolved: 0,
    lastSolvedAt: 0,
    difficulty: 'easy',
    sessionLogs: [],
    achievements: [],
    performanceMetrics: {
      speed: 0,
      accuracy: 0,
      consistency: 0,
      problemSolving: 0,
      mentalMath: 0
    },
    dayActivity: []
  });

  it('unlocks addition by default', () => {
    const topics = calculateTopicProgress(null);
    const addition = topics.find(t => t.id === 'addition');
    expect(addition?.isUnlocked).toBe(true);
  });

  it('unlocks subtraction when addition mastery achievement is earned', () => {
    const stats = mockStats({ addition: 100 });
    stats.achievements = ['addition-master'];
    const topics = calculateTopicProgress(stats);
    const subtraction = topics.find(t => t.id === 'subtraction');
    expect(subtraction?.isUnlocked).toBe(true);
  });

  it('keeps subtraction locked if addition mastery achievement is missing', () => {
    const topics = calculateTopicProgress(mockStats({ addition: 100 }));
    const subtraction = topics.find(t => t.id === 'subtraction');
    expect(subtraction?.isUnlocked).toBe(false);
  });

  it('handles per-topic progress independently', () => {
    // 100 in addition, 50 in subtraction
    const stats = mockStats({ addition: 100, subtraction: 50 });
    stats.achievements = ['addition-master'];
    const topics = calculateTopicProgress(stats);

    expect(topics.find(t => t.id === 'addition')?.progress).toBe(100);
    expect(topics.find(t => t.id === 'subtraction')?.progress).toBe(50);
    expect(topics.find(t => t.id === 'multiplication')?.isUnlocked).toBe(false);
  });

  it('unlocks multiplication when subtraction mastery achievement is earned', () => {
    const stats = mockStats({ addition: 100, subtraction: 100 });
    stats.achievements = ['addition-master', 'subtraction-master'];
    const topics = calculateTopicProgress(stats);
    const multiplication = topics.find(t => t.id === 'multiplication');
    expect(multiplication?.isUnlocked).toBe(true);
  });

  it('clamps progress between 0 and 100', () => {
    const topics = calculateTopicProgress(mockStats({ addition: 150, subtraction: -10 }));
    expect(topics.find(t => t.id === 'addition')?.progress).toBe(100);
    expect(topics.find(t => t.id === 'subtraction')?.progress).toBe(0);
  });

  it('supports legacy fallback to totalScore for addition', () => {
    const legacyStats: any = {
      totalScore: 75,
      // topicScores is missing
    };
    const topics = calculateTopicProgress(legacyStats);
    expect(topics.find(t => t.id === 'addition')?.progress).toBe(75);
    expect(topics.find(t => t.id === 'subtraction')?.isUnlocked).toBe(false);
  });
});
