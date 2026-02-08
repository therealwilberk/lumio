import { describe, it, expect, vi } from 'vitest';
import * as mathConfig from '@shared/math-config';
import { getProblemCategory } from '../lib/math-utils';
import { calculateTopicProgress } from '../lib/progression';

describe('Configuration Integration', () => {
  it('respects FOUNDATION_MAX_SUM for problem categorization', () => {
    // Current value is 10
    expect(getProblemCategory(mathConfig.FOUNDATION_MAX_SUM)).toBe('Foundation');
    expect(getProblemCategory(mathConfig.FOUNDATION_MAX_SUM + 1)).not.toBe('Foundation');
  });

  it('respects badge-based progression for unlocking topics', () => {
    // Subtraction unlocks only when 'addition-master' badge is present
    const statsWithout = { achievements: [] } as any;
    const statsWith = { achievements: ['addition-master'] } as any;

    const progressWithout = calculateTopicProgress(statsWithout);
    const progressWith = calculateTopicProgress(statsWith);

    expect(progressWithout.find(p => p.id === 'subtraction')?.isUnlocked).toBe(false);
    expect(progressWith.find(p => p.id === 'subtraction')?.isUnlocked).toBe(true);
  });
});
