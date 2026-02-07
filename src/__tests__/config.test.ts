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

  it('respects TOPIC_UNLOCK_THRESHOLD for progression', () => {
    // additionProgress = (score / limit) * 100
    // subtractionUnlocked if additionProgress >= threshold

    const scoreJustBelow = (mathConfig.TOPIC_UNLOCK_THRESHOLD - 1) / 100 * mathConfig.ADDITION_SCORE_LIMIT;
    const scoreAtThreshold = mathConfig.TOPIC_UNLOCK_THRESHOLD / 100 * mathConfig.ADDITION_SCORE_LIMIT;

    const statsBelow = { totalScore: scoreJustBelow } as any;
    const statsAt = { totalScore: scoreAtThreshold } as any;

    const progressBelow = calculateTopicProgress(statsBelow);
    const progressAt = calculateTopicProgress(statsAt);

    expect(progressBelow.find(p => p.id === 'subtraction')?.isUnlocked).toBe(false);
    expect(progressAt.find(p => p.id === 'subtraction')?.isUnlocked).toBe(true);
  });
});
