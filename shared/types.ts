export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export interface SolveLog {
  id: string;
  num1: number;
  num2: number;
  userAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
  difficulty: DifficultyLevel;
  hintUsed: boolean;
  streakAtTime: number;
  timestamp: number;
}
export interface StudentStats {
  id: string;
  streak: number;
  highScore: number;
  totalSolved: number;
  totalScore: number;
  lastSolvedAt: number;
  difficulty: DifficultyLevel;
  sessionLogs: SolveLog[];
}