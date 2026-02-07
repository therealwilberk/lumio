/**
 * Centralized math and progression configuration values.
 * Moving hardcoded values here allows for easier tuning of game balance and difficulty.
 */

// Time Constants
export const MS_PER_DAY = 86400000;
export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_MINUTE = 60;

// Problem Generation & Categories
export const BRIDGE_BASE = 10;
export const FOUNDATION_MAX_SUM = 10;
export const BRIDGE_MAX_SUM = 20;

export const MAX_PROBLEM_GENERATION_RETRIES = 50;
export const MIN_OPERAND_VALUE = 2;
export const MIN_SUM_RATIO = 0.2;
export const FALLBACK_DIVISOR = 1.5;

// Progression & Mastery
export const TOPIC_UNLOCK_THRESHOLD = 80;
export const POINTS_PER_LEVEL = 20;

export const ADDITION_SCORE_LIMIT = 100;
export const SUBTRACTION_SCORE_OFFSET = 100;
export const MULTIPLICATION_SCORE_OFFSET = 200;
export const DIVISION_SCORE_OFFSET = 300;

// Performance Metrics & KPI Defaults
export const DEFAULT_ACTIVITY_HEATMAP_DAYS = 90;
export const SPEED_BENCHMARK_MAX_SECONDS = 10;
export const SPEED_RANGE_SECONDS = 8;
export const STREAK_CONSISTENCY_BENCHMARK_DAYS = 30;
export const CONSISTENCY_BASE_POINTS = 50;
