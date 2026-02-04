import { Hono } from "hono";
import type { Env } from './core-utils';
import { StudentEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { StudentStats, SolveLog } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
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