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

export function calculateTopicProgress(userStats: StudentStats | null): MathTopicData[] {
  // Improved progression logic: topics unlock sequentially based on previous topic mastery
  // In a real app, these would be separate scores, but here we derive them from totalScore for now

  // Addition: 0-100 points
  const additionProgress = userStats?.totalScore ? Math.min((userStats.totalScore / ADDITION_SCORE_LIMIT) * 100, 100) : 35;

  // Subtraction: Unlocks at threshold. 100-200 points
  const subtractionUnlocked = additionProgress >= TOPIC_UNLOCK_THRESHOLD;
  const subtractionProgress = subtractionUnlocked ? Math.min(Math.max(0, (userStats?.totalScore || 0) - SUBTRACTION_SCORE_OFFSET), 100) : 0;

  // Multiplication: Unlocks at threshold. 200-300 points
  const multiplicationUnlocked = subtractionProgress >= TOPIC_UNLOCK_THRESHOLD;
  const multiplicationProgress = multiplicationUnlocked ? Math.min(Math.max(0, (userStats?.totalScore || 0) - MULTIPLICATION_SCORE_OFFSET), 100) : 0;

  // Division: Unlocks at threshold. 300-400 points
  const divisionUnlocked = multiplicationProgress >= TOPIC_UNLOCK_THRESHOLD;
  const divisionProgress = divisionUnlocked ? Math.min(Math.max(0, (userStats?.totalScore || 0) - DIVISION_SCORE_OFFSET), 100) : 0;

  return [
    {
      id: 'addition',
      progress: additionProgress,
      isUnlocked: true,
      level: Math.floor(additionProgress / POINTS_PER_LEVEL) + 1,
    },
    {
      id: 'subtraction',
      progress: subtractionProgress,
      isUnlocked: subtractionUnlocked,
      level: subtractionProgress > 0 ? Math.floor(subtractionProgress / POINTS_PER_LEVEL) + 1 : 1,
    },
    {
      id: 'multiplication',
      progress: multiplicationProgress,
      isUnlocked: multiplicationUnlocked,
      level: multiplicationProgress > 0 ? Math.floor(multiplicationProgress / POINTS_PER_LEVEL) + 1 : 1,
    },
    {
      id: 'division',
      progress: divisionProgress,
      isUnlocked: divisionUnlocked,
      level: divisionProgress > 0 ? Math.floor(divisionProgress / POINTS_PER_LEVEL) + 1 : 1,
    }
  ];
}
