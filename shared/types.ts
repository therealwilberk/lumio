export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export interface StudentStats {
  id: string;
  streak: number;
  highScore: number;
  totalSolved: number;
  totalScore: number;
  lastSolvedAt: number;
  difficulty: DifficultyLevel;
}