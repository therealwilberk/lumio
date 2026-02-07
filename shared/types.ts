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
  // Dashboard Data
  achievements: string[]; // IDs of unlocked achievements
  performanceMetrics: PerformanceMetrics;
  dayActivity: DayActivity[];
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