export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export interface SolveLog {
  id: string;
  topic?: string;
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
  topicScores?: Record<string, number>;
  lastSolvedAt: number;
  difficulty: DifficultyLevel;
  sessionLogs: SolveLog[];
  // Dashboard Data
  achievements: string[]; // IDs of unlocked achievements
  performanceMetrics: PerformanceMetrics;
  dayActivity: DayActivity[];
  // Drill Data
  drillAttempts?: DrillAttempt[];
}

// ============================================
// Dashboard Types
// ============================================

// Session tracking
export interface Session {
  id: string;
  userId: string;
  subject: 'math' | 'kiswahili' | 'agriculture' | 'english';
  topic: string;
  mode: 'practice' | 'lightning-round';
  startTime: Date;
  endTime: Date;
  totalTime: number; // seconds
  problems: Problem[];
}

// Problem tracking (extends existing SolveLog concept)
export interface Problem {
  id: string;
  sessionId: string;
  subject: string;
  topic: string;
  question: string;
  correctAnswer: number;
  userAnswer: number;
  correct: boolean;
  timeSpent: number; // seconds
  hintsUsed: number;
  timestamp: Date;
  num1?: number;
  num2?: number;
}

// Achievement system
export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: 'milestone' | 'performance' | 'streak' | 'special';
  criteria: Record<string, any>;
  points: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  notified: boolean;
}

// Streak tracking
export interface Streak {
  userId: string;
  current: number;
  longest: number;
  lastPracticeDate: Date;
}

// Chart data types
export interface DayActivity {
  date: string; // YYYY-MM-DD
  problemCount: number;
  practiceTime: number; // seconds
  subjects: string[];
}

export interface PerformanceMetrics {
  speed: number; // 0-100
  accuracy: number; // 0-100
  consistency: number; // 0-100
  problemSolving: number; // 0-100
  mentalMath: number; // 0-100
}

export interface SpeedSession {
  sessionNumber: number;
  date: Date;
  avgTime: number;
  accuracy: number;
  problemCount: number;
}

export interface TopicMastery {
  topic: string;
  subject: string;
  completionPercent: number;
  currentLevel: number;
  totalLevels: number;
  accuracy: number;
  avgTime: number;
  problemsSolved: number;
}

export interface TroubleProblem {
  problem: string;
  missed: number;
  total: number;
  failureRate: number;
}

// ============================================
// Speed Drill Types
// ============================================

export interface DrillProblem {
  question: string;
  answer: number;
  userAnswer: number;
  timeSpent: number;
  correct: boolean;
}

export interface DrillResult {
  drillId: string;
  userId: string;
  topic: string;
  range: string;
  date: string;
  totalTime: number;
  problems: DrillProblem[];
  accuracy: number;
  averageTime: number;
  bestStreak: number;
}

export interface DrillAttempt {
  drillId: string;
  date: string;
  totalTime: number;
  accuracy: number;
  averageTime: number;
  bestStreak: number;
}

// Dashboard API response
export interface DashboardResponse {
  kpis: {
    totalTime: string;
    totalProblems: number;
    accuracy: number;
    streak: number;
  };
  charts: {
    activityHeatmap: DayActivity[];
    performanceRadar: PerformanceMetrics;
    speedTrend: SpeedSession[];
    topicMastery: TopicMastery[];
  };
  achievements: {
    unlocked: Achievement[];
    locked: Achievement[];
    recentUnlocks: Achievement[];
  };
  troubleSpots: TroubleProblem[];
}