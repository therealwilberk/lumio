import { Hono } from "hono";
import type { Env } from './core-utils';
import { StudentEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { StudentStats, SolveLog } from "@shared/types";

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
        sessionLogs: []
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
        sessionLogs: []
      });
      return ok(c, initial);
    }
    return ok(c, await student.getState());
  });
  
  app.post('/api/student/:id/progress', async (c) => {
    const id = c.req.param('id');
    const { isCorrect, points, solveLog } = (await c.req.json()) as { isCorrect: boolean; points?: number; solveLog?: SolveLog };
    const student = new StudentEntity(c.env, id);
    if (!await student.exists()) return notFound(c, 'student not found');
    const updated = await student.updateProgress(isCorrect, points ?? 1, solveLog);
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
}