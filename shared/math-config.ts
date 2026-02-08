/**
 * Centralized math and progression configuration values.
 * Moving hardcoded values here allows for easier tuning of game balance and difficulty.
 */

import { DifficultyLevel } from './types';

// Time Constants
export const MS_PER_DAY = 86400000;
export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_MINUTE = 60;

// Problem Generation & Categories
export const BRIDGE_BASE = 10;
export const FOUNDATION_MAX_SUM = 10;

export const PROBLEM_LIMITS: Record<DifficultyLevel, { min: number; max: number }> = {
  easy: { min: 2, max: 10 },
  medium: { min: 2, max: 20 },
  hard: { min: 10, max: 100 },
};

export const MULTIPLICATION_LIMITS: Record<DifficultyLevel, { min1: number; max1: number; min2: number; max2: number }> = {
  easy: { min1: 1, max1: 20, min2: 1, max2: 5 },
  medium: { min1: 1, max1: 50, min2: 1, max2: 10 },
  hard: { min1: 10, max1: 99, min2: 2, max2: 12 },
};

export const DIVISION_LIMITS: Record<DifficultyLevel, { minDividend: number; maxDividend: number; minDivisor: number; maxDivisor: number }> = {
  easy: { minDividend: 10, maxDividend: 99, minDivisor: 2, maxDivisor: 9 },
  medium: { minDividend: 100, maxDividend: 999, minDivisor: 5, maxDivisor: 12 },
  hard: { minDividend: 1000, maxDividend: 9999, minDivisor: 10, maxDivisor: 99 },
};

// Legacy support - default to medium
export const BRIDGE_MAX_SUM = PROBLEM_LIMITS.medium.max;

export const MAX_PROBLEM_GENERATION_RETRIES = 50;
export const MIN_OPERAND_VALUE = 2;
export const MIN_SUM_RATIO = 0.2;
export const FALLBACK_DIVISOR = 1.5;

// Progression & Mastery
export const TOPIC_UNLOCK_THRESHOLD = 80;
export const POINTS_PER_LEVEL = 20;

export const TOPIC_SCORE_LIMITS: Record<string, number> = {
  addition: 100,
  subtraction: 100,
  multiplication: 100,
  division: 100
};

// Legacy support
export const ADDITION_SCORE_LIMIT = TOPIC_SCORE_LIMITS.addition;
export const SUBTRACTION_SCORE_OFFSET = 100;
export const MULTIPLICATION_SCORE_OFFSET = 200;
export const DIVISION_SCORE_OFFSET = 300;

// Performance Metrics & KPI Defaults
export const DEFAULT_ACTIVITY_HEATMAP_DAYS = 90;

export interface SpeedBenchmark {
  max: number;
  range: number;
}

export const SPEED_BENCHMARKS: Record<DifficultyLevel, SpeedBenchmark> = {
  easy: { max: 15, range: 12 },    // 15s is 0, 3s is 100
  medium: { max: 10, range: 8 },    // 10s is 0, 2s is 100
  hard: { max: 5, range: 4 },       // 5s is 0, 1s is 100
};

// Legacy support
export const SPEED_BENCHMARK_MAX_SECONDS = SPEED_BENCHMARKS.medium.max;
export const SPEED_RANGE_SECONDS = SPEED_BENCHMARKS.medium.range;

export const STREAK_CONSISTENCY_BENCHMARK_DAYS = 30;
export const CONSISTENCY_BASE_POINTS = 50;
