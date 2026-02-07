import { IndexedEntity } from "./core-utils";
import type { StudentStats, SolveLog } from "@shared/types";
export class StudentEntity extends IndexedEntity<StudentStats> {
  static readonly entityName = "student";
  static readonly indexName = "students";
  static readonly initialState: StudentStats = {
    id: "",
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
  };
  async updateProgress(isCorrect: boolean, points: number = 1, solveLog?: SolveLog): Promise<StudentStats> {
    return this.mutate((s) => {
      const now = Date.now();
      let newStreak = s.streak;
      let newHighScore = s.highScore;
      let newTotalSolved = s.totalSolved;
      let newTotalScore = s.totalScore;
      if (isCorrect) {
        newStreak += 1;
        newTotalSolved += 1;
        newTotalScore += points;
        if (newStreak > newHighScore) {
          newHighScore = newStreak;
        }
      } else {
        newStreak = 0;
      }
      const updatedLogs = solveLog
        ? [solveLog, ...(s.sessionLogs || [])].slice(0, 100)
        : (s.sessionLogs || []);
      return {
        ...s,
        streak: newStreak,
        highScore: newHighScore,
        totalSolved: newTotalSolved,
        totalScore: newTotalScore,
        lastSolvedAt: now,
        sessionLogs: updatedLogs
      };
    });
  }
  async updateSettings(settings: Partial<StudentStats>): Promise<StudentStats> {
    return this.mutate((s) => ({
      ...s,
      ...settings,
      id: s.id
    }));
  }
}