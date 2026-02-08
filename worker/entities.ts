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
    topicScores: {
      addition: 0,
      subtraction: 0,
      multiplication: 0,
      division: 0
    },
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
  async updateProgress(isCorrect: boolean, points: number = 1, solveLog?: SolveLog, topic?: string): Promise<StudentStats> {
    return this.mutate((s) => {
      const now = Date.now();
      let newStreak = s.streak;
      let newHighScore = s.highScore;
      let newTotalSolved = s.totalSolved;
      let newTotalScore = s.totalScore;

      const newTopicScores = { ...(s.topicScores || {}) };

      if (isCorrect) {
        newStreak += 1;
        newTotalSolved += 1;
        newTotalScore += points;

        // Update specific topic score
        const topicKey = topic || solveLog?.topic || 'addition'; // fallback to addition for legacy
        newTopicScores[topicKey] = (newTopicScores[topicKey] || 0) + points;

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
        topicScores: newTopicScores,
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