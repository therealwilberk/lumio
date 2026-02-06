import type { StudentStats } from '@shared/types';

export interface MathTopicData {
  id: string;
  progress: number;
  isUnlocked: boolean;
  level: number;
}

export const TOPIC_UNLOCK_THRESHOLD = 80;

export function calculateTopicProgress(userStats: StudentStats | null): MathTopicData[] {
  // Improved progression logic: topics unlock sequentially based on previous topic mastery
  // In a real app, these would be separate scores, but here we derive them from totalScore for now

  // Addition: 0-100 points
  const additionProgress = userStats?.totalScore ? Math.min((userStats.totalScore / 100) * 100, 100) : 35;

  // Subtraction: Unlocks at 80% Addition. 100-200 points
  const subtractionUnlocked = additionProgress >= TOPIC_UNLOCK_THRESHOLD;
  const subtractionProgress = subtractionUnlocked ? Math.min(Math.max(0, (userStats?.totalScore || 0) - 100), 100) : 0;

  // Multiplication: Unlocks at 80% Subtraction. 200-300 points
  const multiplicationUnlocked = subtractionProgress >= TOPIC_UNLOCK_THRESHOLD;
  const multiplicationProgress = multiplicationUnlocked ? Math.min(Math.max(0, (userStats?.totalScore || 0) - 200), 100) : 0;

  // Division: Unlocks at 80% Multiplication. 300-400 points
  const divisionUnlocked = multiplicationProgress >= TOPIC_UNLOCK_THRESHOLD;
  const divisionProgress = divisionUnlocked ? Math.min(Math.max(0, (userStats?.totalScore || 0) - 300), 100) : 0;

  return [
    {
      id: 'addition',
      progress: additionProgress,
      isUnlocked: true,
      level: Math.floor(additionProgress / 20) + 1,
    },
    {
      id: 'subtraction',
      progress: subtractionProgress,
      isUnlocked: subtractionUnlocked,
      level: subtractionProgress > 0 ? Math.floor(subtractionProgress / 20) + 1 : 1,
    },
    {
      id: 'multiplication',
      progress: multiplicationProgress,
      isUnlocked: multiplicationUnlocked,
      level: multiplicationProgress > 0 ? Math.floor(multiplicationProgress / 20) + 1 : 1,
    },
    {
      id: 'division',
      progress: divisionProgress,
      isUnlocked: divisionUnlocked,
      level: divisionProgress > 0 ? Math.floor(divisionProgress / 20) + 1 : 1,
    }
  ];
}
