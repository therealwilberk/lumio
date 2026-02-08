import { Hono } from "hono";
import type { Env } from './core-utils';
import { StudentEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { StudentStats, SolveLog, Session, DashboardResponse, Achievement, Problem } from "@shared/types";
import { ALL_ACHIEVEMENTS } from '@shared/achievements';
import {
  calculateTotalPracticeTime,
  generateActivityHeatmap,
  calculatePerformanceMetrics,
  checkAchievementCriteria,
  calculateAccuracy,
  calculateStreak
} from '@shared/dashboard-calculations';

// Simple JWT implementation (for demo purposes)
const JWT_SECRET = 'lumio-secret-key-change-in-production';

function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ userId, iat: Date.now() }));
  const signature = btoa(`${header}.${payload}.${JWT_SECRET}`);
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token: string): { userId: string } | null {
  try {
    const [header, payload, signature] = token.split('.');
    const expectedSignature = btoa(`${header}.${payload}.${JWT_SECRET}`);

    if (signature !== expectedSignature) return null;

    const decoded = JSON.parse(atob(payload));
    // Check if token is not too old (24 hours)
    if (Date.now() - decoded.iat > 24 * 60 * 60 * 1000) return null;

    return { userId: decoded.userId };
  } catch {
    return null;
  }
}

// Simple password hashing (for demo purposes - use bcrypt in production)
function hashPin(pin: string): string {
  // Simple hash - replace with bcrypt in production
  return btoa(pin + JWT_SECRET).split('').reverse().join('');
}

function verifyPin(pin: string, hash: string): boolean {
  return hashPin(pin) === hash;
}

export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Authentication routes
  app.post('/api/auth/signup', async (c) => {
    try {
      const { username, pin } = await c.req.json();

      // Validation
      if (!username || !pin) {
        return bad(c, 'Username and PIN are required');
      }

      if (username.length < 3 || username.length > 20) {
        return bad(c, 'Username must be 3-20 characters');
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return bad(c, 'Username can only contain letters, numbers, and underscores');
      }

      if (pin.length < 4) {
        return bad(c, 'PIN must be at least 4 characters');
      }

      // Check if username already exists (using Global DO for user management)
      const globalDOId = c.env.GlobalDurableObject.idFromName('global');
      const globalDO = c.env.GlobalDurableObject.get(globalDOId);
      const existingUser = await globalDO.getUserByUsername(username);

      if (existingUser) {
        return bad(c, 'Username already exists');
      }

      // Create new user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const hashedPin = hashPin(pin);

      await globalDO.createUser({
        id: userId,
        username,
        pinHash: hashedPin,
        createdAt: new Date().toISOString()
      });

      // Create student stats
      await StudentEntity.create(c.env, {
        id: userId,
        streak: 0,
        highScore: 0,
        totalSolved: 0,
        totalScore: 0,
        lastSolvedAt: 0,
        difficulty: "easy",
        sessionLogs: [],
        achievements: [],
        performanceMetrics: {
          speed: 0,
          accuracy: 0,
          consistency: 0,
          problemSolving: 0,
          mentalMath: 0
        },
        dayActivity: []
      });

      const token = generateToken(userId);

      return ok(c, {
        user: { id: userId, username, createdAt: new Date().toISOString() },
        token
      });
    } catch (error) {
      console.error('Signup error:', error);
      return bad(c, 'Signup failed');
    }
  });

  app.post('/api/auth/login', async (c) => {
    try {
      const { username, pin } = await c.req.json();

      if (!username || !pin) {
        return bad(c, 'Username and PIN are required');
      }

      // Find user by username
      const globalDOId = c.env.GlobalDurableObject.idFromName('global');
      const globalDO = c.env.GlobalDurableObject.get(globalDOId);
      const user = await globalDO.getUserByUsername(username);

      if (!user) {
        return bad(c, 'Invalid username or PIN');
      }

      // Verify PIN
      if (!verifyPin(pin, user.pinHash)) {
        return bad(c, 'Invalid username or PIN');
      }

      const token = generateToken(user.id);

      return ok(c, {
        user: { id: user.id, username: user.username, createdAt: user.createdAt },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      return bad(c, 'Login failed');
    }
  });

  app.get('/api/auth/verify', async (c) => {
    try {
      const authHeader = c.req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return bad(c, 'No token provided');
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (!decoded) {
        return bad(c, 'Invalid token');
      }

      // Get user info
      const globalDOId = c.env.GlobalDurableObject.idFromName('global');
      const globalDO = c.env.GlobalDurableObject.get(globalDOId);
      const user = await globalDO.getUser(decoded.userId);

      if (!user) {
        return bad(c, 'User not found');
      }

      return ok(c, {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error('Verify error:', error);
      return bad(c, 'Token verification failed');
    }
  });

  app.post('/api/auth/logout', async (c) => {
    // In a real implementation, you might want to invalidate the token
    // For now, we'll just return success
    return ok(c, { message: 'Logged out successfully' });
  });

  // Existing student routes
  app.get('/api/student/:id', async (c) => {
    const id = c.req.param('id');
    const student = new StudentEntity(c.env, id);
    if (!await student.exists()) {
      const initial = await StudentEntity.create(c.env, {
        id,
        streak: 0,
        highScore: 0,
        totalSolved: 0,
        totalScore: 0,
        lastSolvedAt: 0,
        difficulty: "easy",
        sessionLogs: [],
        achievements: [],
        performanceMetrics: {
          speed: 0,
          accuracy: 0,
          consistency: 0,
          problemSolving: 0,
          mentalMath: 0
        },
        dayActivity: []
      });
      return ok(c, initial);
    }
    return ok(c, await student.getState());
  });

  app.post('/api/student/:id/progress', async (c) => {
    const id = c.req.param('id');
    const { isCorrect, points, solveLog, topic } = (await c.req.json()) as {
      isCorrect: boolean;
      points?: number;
      solveLog?: SolveLog;
      topic?: string;
    };
    const student = new StudentEntity(c.env, id);
    if (!await student.exists()) return notFound(c, 'student not found');
    const updated = await student.updateProgress(isCorrect, points ?? 1, solveLog, topic);
    return ok(c, updated);
  });

  app.patch('/api/student/:id/settings', async (c) => {
    const id = c.req.param('id');
    const settings = await c.req.json() as Partial<StudentStats>;
    const student = new StudentEntity(c.env, id);
    if (!await student.exists()) return notFound(c, 'student not found');
    const updated = await student.updateSettings(settings);
    return ok(c, updated);
  });

  // ============================================
  // DASHBOARD ROUTES
  // ============================================

  // Get full dashboard data
  app.get('/api/dashboard/:userId', async (c) => {
    const userId = c.req.param('userId');
    const student = new StudentEntity(c.env, userId);

    if (!await student.exists()) {
      return notFound(c, 'User stats not found');
    }

    const stats = await student.getState();

    // Convert SolveLog[] to Problem[] for calculations
    // Note: SolveLog is a subset of Problem, so we map what we have
    const problems: Problem[] = stats.sessionLogs.map(log => ({
      id: log.id,
      sessionId: 'legacy', // Legacy logs don't have session IDs
      subject: 'math', // Default to math for legacy
      topic: 'general',
      question: `${log.num1} ${log.num2}`, // Approximation
      correctAnswer: 0, // Not stored in legacy
      userAnswer: log.userAnswer,
      correct: log.isCorrect,
      timeSpent: log.timeTaken,
      hintsUsed: log.hintUsed ? 1 : 0,
      timestamp: new Date(log.timestamp)
    }));

    // Calculate/Refresh KPIs derived from logs
    // In a real app, we might store these pre-calculated, but recalculating ensures accuracy
    const totalTime = problems.reduce((sum, p) => sum + p.timeSpent, 0);
    const activityHeatmap = generateActivityHeatmap(problems);
    const performanceMetrics = calculatePerformanceMetrics(problems, stats.streak, stats.difficulty);

    // Sort achievements
    const unlockedAchievements = ALL_ACHIEVEMENTS.filter(a => stats.achievements?.includes(a.id));
    const lockedAchievements = ALL_ACHIEVEMENTS.filter(a => !stats.achievements?.includes(a.id));

    const response: DashboardResponse = {
      kpis: {
        totalTime: formatPracticeTime(totalTime), // Need to import this or inline it
        totalProblems: stats.totalSolved,
        accuracy: calculateAccuracy(problems),
        streak: stats.streak
      },
      charts: {
        activityHeatmap,
        performanceRadar: performanceMetrics,
        speedTrend: [
          { sessionNumber: 1, date: new Date(Date.now() - 86400000 * 9), avgTime: 8.5, accuracy: 70, problemCount: 10 },
          { sessionNumber: 2, date: new Date(Date.now() - 86400000 * 8), avgTime: 7.2, accuracy: 75, problemCount: 15 },
          { sessionNumber: 3, date: new Date(Date.now() - 86400000 * 7), avgTime: 6.8, accuracy: 80, problemCount: 12 },
          { sessionNumber: 4, date: new Date(Date.now() - 86400000 * 6), avgTime: 6.5, accuracy: 85, problemCount: 20 },
          { sessionNumber: 5, date: new Date(Date.now() - 86400000 * 5), avgTime: 5.9, accuracy: 82, problemCount: 18 },
          { sessionNumber: 6, date: new Date(Date.now() - 86400000 * 4), avgTime: 5.5, accuracy: 90, problemCount: 25 },
          { sessionNumber: 7, date: new Date(Date.now() - 86400000 * 3), avgTime: 5.2, accuracy: 88, problemCount: 22 },
          { sessionNumber: 8, date: new Date(Date.now() - 86400000 * 2), avgTime: 4.8, accuracy: 92, problemCount: 30 },
          { sessionNumber: 9, date: new Date(Date.now() - 86400000 * 1), avgTime: 4.5, accuracy: 95, problemCount: 28 },
          { sessionNumber: 10, date: new Date(), avgTime: 4.2, accuracy: 98, problemCount: 35 }
        ],
        topicMastery: [
          { topic: 'Addition', subject: 'Math', completionPercent: 100, currentLevel: 10, totalLevels: 10, accuracy: 98, avgTime: 2.5, problemsSolved: 500 },
          { topic: 'Subtraction', subject: 'Math', completionPercent: 75, currentLevel: 7, totalLevels: 10, accuracy: 92, avgTime: 3.8, problemsSolved: 350 },
          { topic: 'Multiplication', subject: 'Math', completionPercent: 45, currentLevel: 4, totalLevels: 10, accuracy: 85, avgTime: 5.2, problemsSolved: 120 },
          { topic: 'Division', subject: 'Math', completionPercent: 20, currentLevel: 2, totalLevels: 10, accuracy: 78, avgTime: 6.5, problemsSolved: 60 }
        ]
      },
      achievements: {
        unlocked: unlockedAchievements,
        locked: lockedAchievements,
        recentUnlocks: []
      },
      troubleSpots: []
    };

    return ok(c, response);
  });

  // Complete a session
  app.post('/api/session/complete', async (c) => {
    const { userId, session } = await c.req.json() as { userId: string; session: Session };
    const student = new StudentEntity(c.env, userId);

    if (!await student.exists()) {
      return notFound(c, 'User not found');
    }

    // Update stats
    const currentState = await student.getState();
    const newUnlockedAchievements: Achievement[] = [];

    // Check for achievements
    // Combine existing problems with new session problems for checking
    const allProblems = [
      ...currentState.sessionLogs.map(log => ({
        id: log.id,
        sessionId: 'legacy',
        subject: 'math',
        topic: 'general',
        question: `${log.num1} ? ${log.num2}`,
        correctAnswer: 0,
        userAnswer: log.userAnswer,
        correct: log.isCorrect,
        timeSpent: log.timeTaken,
        hintsUsed: log.hintUsed ? 1 : 0,
        timestamp: new Date(log.timestamp)
      })),
      ...session.problems
    ];

    const currentStatsForCheck = {
      totalProblems: currentState.totalSolved + session.problems.length,
      accuracy: calculateAccuracy(allProblems),
      streak: currentState.streak, // Will be updated
      avgTime: allProblems.reduce((sum, p) => sum + p.timeSpent, 0) / allProblems.length,
      sessions: [], // Populate if we start storing full sessions
      problems: allProblems
    };

    // Check all locked achievements
    const unlockedIds = currentState.achievements || [];
    const lockedAchievements = ALL_ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id));

    for (const achievement of lockedAchievements) {
      if (checkAchievementCriteria(achievement, currentStatsForCheck)) {
        newUnlockedAchievements.push(achievement);
        unlockedIds.push(achievement.id);
      }
    }

    // Update state
    await student.mutate(s => ({
      ...s,
      totalSolved: s.totalSolved + session.problems.length,
      // Update other stats...
      achievements: unlockedIds,
      // Add simplified logs
      sessionLogs: [
        ...session.problems.map(p => ({
          id: p.id,
          num1: p.num1 || 0,
          num2: p.num2 || 0,
          userAnswer: p.userAnswer,
          isCorrect: p.correct,
          timeTaken: p.timeSpent,
          difficulty: 'medium' as 'medium', // Use exact string literal type
          hintUsed: p.hintsUsed > 0,
          streakAtTime: s.streak,
          timestamp: new Date(p.timestamp).getTime()
        })),
        ...s.sessionLogs
      ].slice(0, 100)
    }));

    return ok(c, {
      success: true,
      newAchievements: newUnlockedAchievements
    });
  });
}

function formatPracticeTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}