import { IndexedEntity } from "./core-utils";
import type { User } from "@shared/types";
import { MOCK_USERS } from "@shared/mock-data";
export interface StudentStats {
  id: string;
  streak: number;
  highScore: number;
  totalSolved: number;
  lastSolvedAt: number;
}
export class StudentEntity extends IndexedEntity<StudentStats> {
  static readonly entityName = "student";
  static readonly indexName = "students";
  static readonly initialState: StudentStats = {
    id: "",
    streak: 0,
    highScore: 0,
    totalSolved: 0,
    lastSolvedAt: 0
  };
  async updateProgress(isCorrect: boolean): Promise<StudentStats> {
    return this.mutate((s) => {
      const now = Date.now();
      let newStreak = s.streak;
      let newHighScore = s.highScore;
      let newTotalSolved = s.totalSolved;
      if (isCorrect) {
        newStreak += 1;
        newTotalSolved += 1;
        if (newStreak > newHighScore) {
          newHighScore = newStreak;
        }
      } else {
        newStreak = 0;
      }
      return {
        ...s,
        streak: newStreak,
        highScore: newHighScore,
        totalSolved: newTotalSolved,
        lastSolvedAt: now
      };
    });
  }
}
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}