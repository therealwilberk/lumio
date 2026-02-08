import type { StudentStats } from '@shared/types';
import {
  TOPIC_UNLOCK_THRESHOLD,
  ADDITION_SCORE_LIMIT,
  SUBTRACTION_SCORE_OFFSET,
  MULTIPLICATION_SCORE_OFFSET,
  DIVISION_SCORE_OFFSET,
  POINTS_PER_LEVEL
} from '@shared/math-config';

export interface MathTopicData {
  id: string;
  progress: number;
  isUnlocked: boolean;
  level: number;
}

export { TOPIC_UNLOCK_THRESHOLD };

/**
 * Calculates progress and unlock status for each math topic.
 * Topics unlock sequentially: Addition -> Subtraction -> Multiplication -> Division.
 * A topic is unlocked when the previous one reaches the TOPIC_UNLOCK_THRESHOLD (80%).
 */
export function calculateTopicProgress(userStats: StudentStats | null): MathTopicData[] {
  // Derive progress from totalScore based on defined offsets
  // Addition: 0-100 points
  const additionProgress = userStats?.totalScore
    ? Math.min((userStats.totalScore / ADDITION_SCORE_LIMIT) * 100, 100)
    : 0;

  // Subtraction: Unlocks at 80% Addition mastery. 100-200 points range
  const subtractionUnlocked = additionProgress >= TOPIC_UNLOCK_THRESHOLD;
  const subtractionProgress = subtractionUnlocked
    ? Math.min(Math.max(0, (userStats?.totalScore || 0) - SUBTRACTION_SCORE_OFFSET), 100)
    : 0;

  // Multiplication: Unlocks at 80% Subtraction mastery. 200-300 points range
  const multiplicationUnlocked = subtractionUnlocked && subtractionProgress >= TOPIC_UNLOCK_THRESHOLD;
  const multiplicationProgress = multiplicationUnlocked
    ? Math.min(Math.max(0, (userStats?.totalScore || 0) - MULTIPLICATION_SCORE_OFFSET), 100)
    : 0;

  // Division: Unlocks at 80% Multiplication mastery. 300-400 points range
  const divisionUnlocked = multiplicationUnlocked && multiplicationProgress >= TOPIC_UNLOCK_THRESHOLD;
  const divisionProgress = divisionUnlocked
    ? Math.min(Math.max(0, (userStats?.totalScore || 0) - DIVISION_SCORE_OFFSET), 100)
    : 0;

  return [
    {
      id: 'addition',
      progress: Math.round(additionProgress),
      isUnlocked: true,
      level: Math.floor(additionProgress / POINTS_PER_LEVEL) + 1,
    },
    {
      id: 'subtraction',
      progress: Math.round(subtractionProgress),
      isUnlocked: subtractionUnlocked,
      level: subtractionProgress > 0 ? Math.floor(subtractionProgress / POINTS_PER_LEVEL) + 1 : 1,
    },
    {
      id: 'multiplication',
      progress: Math.round(multiplicationProgress),
      isUnlocked: multiplicationUnlocked,
      level: multiplicationProgress > 0 ? Math.floor(multiplicationProgress / POINTS_PER_LEVEL) + 1 : 1,
    },
    {
      id: 'division',
      progress: Math.round(divisionProgress),
      isUnlocked: divisionUnlocked,
      level: divisionProgress > 0 ? Math.floor(divisionProgress / POINTS_PER_LEVEL) + 1 : 1,
    }
  ];
}
