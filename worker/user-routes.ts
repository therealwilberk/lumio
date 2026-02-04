import { Hono } from "hono";
import type { Env } from './core-utils';
import { StudentEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/student/:id', async (c) => {
    const id = c.req.param('id');
    const student = new StudentEntity(c.env, id);
    if (!await student.exists()) {
      // Create on the fly if doesn't exist
      const initial = await StudentEntity.create(c.env, { 
        id, 
        streak: 0, 
        highScore: 0, 
        totalSolved: 0, 
        lastSolvedAt: 0 
      });
      return ok(c, initial);
    }
    return ok(c, await student.getState());
  });
  app.post('/api/student/:id/progress', async (c) => {
    const id = c.req.param('id');
    const { isCorrect } = (await c.req.json()) as { isCorrect: boolean };
    const student = new StudentEntity(c.env, id);
    if (!await student.exists()) return notFound(c, 'student not found');
    const updated = await student.updateProgress(isCorrect);
    return ok(c, updated);
  });
}