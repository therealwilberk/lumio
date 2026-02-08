import type { StudentStats } from '@shared/types';
import {
  TOPIC_UNLOCK_THRESHOLD,
  TOPIC_SCORE_LIMITS,
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
  const getTopicScore = (topicId: string) => {
    if (!userStats) return 0;

    // Use per-topic scores if available, otherwise fallback to legacy totalScore for addition
    if (userStats.topicScores && userStats.topicScores[topicId] !== undefined) {
      return userStats.topicScores[topicId];
    }

    if (topicId === 'addition') return userStats.totalScore || 0;
    return 0;
  };

  const calculateProgress = (score: number, limit: number) => {
    if (limit <= 0) return 0;
    return Math.min(Math.max(0, (score / limit) * 100), 100);
  };

  // Addition
  const additionScore = getTopicScore('addition');
  const additionProgress = calculateProgress(additionScore, TOPIC_SCORE_LIMITS.addition);

  // Subtraction: Unlocks at 80% Addition mastery
  const subtractionUnlocked = additionProgress >= TOPIC_UNLOCK_THRESHOLD;
  const subtractionScore = getTopicScore('subtraction');
  const subtractionProgress = subtractionUnlocked
    ? calculateProgress(subtractionScore, TOPIC_SCORE_LIMITS.subtraction)
    : 0;

  // Multiplication: Unlocks at 80% Subtraction mastery
  const multiplicationUnlocked = subtractionUnlocked && subtractionProgress >= TOPIC_UNLOCK_THRESHOLD;
  const multiplicationScore = getTopicScore('multiplication');
  const multiplicationProgress = multiplicationUnlocked
    ? calculateProgress(multiplicationScore, TOPIC_SCORE_LIMITS.multiplication)
    : 0;

  // Division: Unlocks at 80% Multiplication mastery
  const divisionUnlocked = multiplicationUnlocked && multiplicationProgress >= TOPIC_UNLOCK_THRESHOLD;
  const divisionScore = getTopicScore('division');
  const divisionProgress = divisionUnlocked
    ? calculateProgress(divisionScore, TOPIC_SCORE_LIMITS.division)
    : 0;

  return [
    {
      id: 'addition',
      progress: Math.round(additionProgress),
      isUnlocked: true,
      level: Math.min(Math.floor(additionProgress / POINTS_PER_LEVEL) + 1, 5),
    },
    {
      id: 'subtraction',
      progress: Math.round(subtractionProgress),
      isUnlocked: subtractionUnlocked,
      level: subtractionUnlocked ? Math.min(Math.floor(subtractionProgress / POINTS_PER_LEVEL) + 1, 5) : 1,
    },
    {
      id: 'multiplication',
      progress: Math.round(multiplicationProgress),
      isUnlocked: multiplicationUnlocked,
      level: multiplicationUnlocked ? Math.min(Math.floor(multiplicationProgress / POINTS_PER_LEVEL) + 1, 5) : 1,
    },
    {
      id: 'division',
      progress: Math.round(divisionProgress),
      isUnlocked: divisionUnlocked,
      level: divisionUnlocked ? Math.min(Math.floor(divisionProgress / POINTS_PER_LEVEL) + 1, 5) : 1,
    }
  ];
}
