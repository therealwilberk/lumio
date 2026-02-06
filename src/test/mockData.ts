export const mockUser = {
  id: 'user_test_123',
  username: 'TestKid',
  createdAt: new Date('2026-01-01').toISOString(),
};

export const mockSession = {
  id: 'session_test_123',
  userId: 'user_test_123',
  topic: 'addition',
  level: 3,
  startTime: new Date('2026-02-06T10:00:00Z').toISOString(),
  endTime: new Date('2026-02-06T10:15:00Z').toISOString(),
  problems: [
    {
      question: '7 + 3',
      correctAnswer: 10,
      userAnswer: 10,
      correct: true,
      timeSpent: 3.2,
      hintsUsed: 0,
    },
    {
      question: '5 + 8',
      correctAnswer: 13,
      userAnswer: 13,
      correct: true,
      timeSpent: 2.8,
      hintsUsed: 0,
    },
  ],
  totalScore: 40,
  accuracy: 1.0,
  avgTime: 3.0,
};

export const mockProgress = {
  userId: 'user_test_123',
  topics: {
    addition: {
      currentLevel: 3,
      completionPercent: 60,
      totalProblems: 50,
      totalCorrect: 45,
      accuracy: 0.9,
      avgSpeed: 4.2,
    },
  },
  streak: {
    current: 5,
    longest: 12,
  },
};
