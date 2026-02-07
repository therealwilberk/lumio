# Lumio Dashboard Data Architecture & System Design

## Context
Before building the premium dashboard, we need to define:
1. What KPIs to track
2. How badges work
3. User data structure
4. Calculation logic
5. API design

**Current Stack**: Cloudflare Workers + Durable Objects
**Future**: Expandable to other subjects beyond math

---

## 🎯 Core KPIs (What to Track)

### 1. Practice Time
**Definition**: Total time spent actively solving problems

**Calculation**:
```javascript
totalPracticeTime = sessions.reduce((sum, session) => {
  return sum + (session.endTime - session.startTime);
}, 0);

// Format: "2h 45m"
function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}
```

**Weekly Trend**:
```javascript
thisWeekTime = getSessionsInRange(startOfWeek, now);
lastWeekTime = getSessionsInRange(startOfLastWeek, endOfLastWeek);
trend = ((thisWeekTime - lastWeekTime) / lastWeekTime * 100).toFixed(0);
// "+12% this week"
```

---

### 2. Problems Solved
**Definition**: Total number of problems attempted (correct + incorrect)

**Calculation**:
```javascript
totalProblems = sessions.reduce((sum, session) => {
  return sum + session.problems.length;
}, 0);

// Weekly trend (same logic as practice time)
```

**Breakdown by Topic**:
```javascript
problemsByTopic = {
  addition: 150,
  subtraction: 87,
  multiplication: 35,
  division: 15
};
```

---

### 3. Accuracy Rate
**Definition**: Percentage of problems answered correctly on first attempt

**Calculation**:
```javascript
const allProblems = sessions.flatMap(s => s.problems);
const correctProblems = allProblems.filter(p => p.correct);
const accuracy = (correctProblems.length / allProblems.length * 100).toFixed(0);

// "90%"
```

**Subject-Specific Accuracy**:
```javascript
accuracyBySubject = {
  math: {
    addition: 92,
    subtraction: 85,
    multiplication: 78,
    division: 65
  },
  // Future: kiswahili, agriculture, english
};
```

---

### 4. Current Streak
**Definition**: Consecutive days with at least one practice session

**Calculation**:
```javascript
function calculateStreak(sessions) {
  // Sort sessions by date descending
  const dates = [...new Set(sessions.map(s => 
    new Date(s.startTime).toDateString()
  ))].sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const date of dates) {
    const sessionDate = new Date(date);
    const daysDiff = Math.floor((currentDate - sessionDate) / 86400000);
    
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Display: "5 days 🔥"
```

**Longest Streak** (for motivation):
```javascript
longestStreak = Math.max(...calculateAllStreaks(sessions));
```

---

### 5. Average Speed (per problem)
**Definition**: Average time to solve a problem correctly

**Calculation**:
```javascript
const correctProblems = sessions
  .flatMap(s => s.problems)
  .filter(p => p.correct);

const avgSpeed = correctProblems.reduce((sum, p) => sum + p.timeSpent, 0) 
  / correctProblems.length;

// "4.2s average"
```

**Speed by Difficulty**:
```javascript
speedByDifficulty = {
  easy: 3.2,    // 1-10 addition
  medium: 5.8,  // 10-20 addition
  hard: 8.5     // 20+ addition
};
```

---

### 6. Improvement Rate
**Definition**: How much faster/more accurate over time

**Calculation**:
```javascript
// Compare last 10 sessions to first 10 sessions
const first10 = sessions.slice(0, 10);
const last10 = sessions.slice(-10);

const speedImprovement = (
  (getAvgSpeed(first10) - getAvgSpeed(last10)) / getAvgSpeed(first10) * 100
).toFixed(0);

// "-37% faster" (negative is good!)

const accuracyImprovement = (
  getAccuracy(last10) - getAccuracy(first10)
).toFixed(0);

// "+8% more accurate"
```

---

## 🏆 Badge System

### Badge Categories

1. **Milestone Badges** - Progress-based
2. **Performance Badges** - Skill-based
3. **Consistency Badges** - Streak-based
4. **Special Badges** - Achievements

### Complete Badge List

```javascript
const BADGES = {
  // MILESTONE BADGES
  first_steps: {
    id: 'first_steps',
    name: 'First Steps',
    icon: '👣',
    description: 'Solved your first 10 problems',
    category: 'milestone',
    unlockCriteria: {
      type: 'problemCount',
      value: 10
    },
    points: 10
  },
  
  problem_solver: {
    id: 'problem_solver',
    name: 'Problem Solver',
    icon: '🧩',
    description: 'Solved 50 problems',
    category: 'milestone',
    unlockCriteria: {
      type: 'problemCount',
      value: 50
    },
    points: 25
  },
  
  century_club: {
    id: 'century_club',
    name: 'Century Club',
    icon: '💯',
    description: 'Solved 100 problems',
    category: 'milestone',
    unlockCriteria: {
      type: 'problemCount',
      value: 100
    },
    points: 50
  },
  
  math_master: {
    id: 'math_master',
    name: 'Math Master',
    icon: '🎓',
    description: 'Solved 500 problems',
    category: 'milestone',
    unlockCriteria: {
      type: 'problemCount',
      value: 500
    },
    points: 100
  },
  
  // PERFORMANCE BADGES
  perfect_ten: {
    id: 'perfect_ten',
    name: 'Perfect 10',
    icon: '⭐',
    description: 'Get 10 problems correct in a row',
    category: 'performance',
    unlockCriteria: {
      type: 'streak',
      value: 10
    },
    points: 20
  },
  
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    icon: '⚡',
    description: 'Average under 5 seconds per problem',
    category: 'performance',
    unlockCriteria: {
      type: 'avgSpeed',
      operator: '<',
      value: 5
    },
    points: 30
  },
  
  lightning_fast: {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    icon: '⚡⚡',
    description: 'Average under 3 seconds per problem',
    category: 'performance',
    unlockCriteria: {
      type: 'avgSpeed',
      operator: '<',
      value: 3
    },
    points: 50
  },
  
  accuracy_ace: {
    id: 'accuracy_ace',
    name: 'Accuracy Ace',
    icon: '🎯',
    description: '95% accuracy over 50 problems',
    category: 'performance',
    unlockCriteria: {
      type: 'accuracyWithMinimum',
      accuracy: 95,
      minimum: 50
    },
    points: 40
  },
  
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfectionist',
    icon: '💎',
    description: '100% accuracy in a session (min 20 problems)',
    category: 'performance',
    unlockCriteria: {
      type: 'perfectSession',
      minimum: 20
    },
    points: 50
  },
  
  // CONSISTENCY BADGES
  daily_learner: {
    id: 'daily_learner',
    name: 'Daily Learner',
    icon: '📅',
    description: 'Practice 3 days in a row',
    category: 'consistency',
    unlockCriteria: {
      type: 'consecutiveDays',
      value: 3
    },
    points: 15
  },
  
  week_warrior: {
    id: 'week_warrior',
    name: 'Week Warrior',
    icon: '🔥',
    description: 'Practice 7 days in a row',
    category: 'consistency',
    unlockCriteria: {
      type: 'consecutiveDays',
      value: 7
    },
    points: 35
  },
  
  dedication_champion: {
    id: 'dedication_champion',
    name: 'Dedication Champion',
    icon: '🏅',
    description: 'Practice 30 days in a row',
    category: 'consistency',
    unlockCriteria: {
      type: 'consecutiveDays',
      value: 30
    },
    points: 100
  },
  
  // SPECIAL BADGES
  early_bird: {
    id: 'early_bird',
    name: 'Early Bird',
    icon: '🌅',
    description: 'Practice before 8am',
    category: 'special',
    unlockCriteria: {
      type: 'timeOfDay',
      before: 8
    },
    points: 10
  },
  
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    icon: '🦉',
    description: 'Practice after 8pm',
    category: 'special',
    unlockCriteria: {
      type: 'timeOfDay',
      after: 20
    },
    points: 10
  },
  
  weekend_warrior: {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    icon: '🎮',
    description: 'Practice on both Saturday and Sunday',
    category: 'special',
    unlockCriteria: {
      type: 'weekendPractice'
    },
    points: 15
  },
  
  comeback_kid: {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    icon: '💪',
    description: 'Return after 7+ day break',
    category: 'special',
    unlockCriteria: {
      type: 'returnAfterBreak',
      days: 7
    },
    points: 20
  },
  
  topic_master_addition: {
    id: 'topic_master_addition',
    name: 'Addition Master',
    icon: '➕',
    description: 'Complete all addition levels',
    category: 'special',
    unlockCriteria: {
      type: 'topicCompletion',
      topic: 'addition',
      completion: 100
    },
    points: 75
  }
};
```

### Badge Unlock Logic

```javascript
function checkBadgeUnlock(userId, badgeId) {
  const badge = BADGES[badgeId];
  const userData = getUserData(userId);
  
  switch (badge.unlockCriteria.type) {
    case 'problemCount':
      return userData.stats.totalProblems >= badge.unlockCriteria.value;
      
    case 'streak':
      return userData.stats.bestStreak >= badge.unlockCriteria.value;
      
    case 'avgSpeed':
      const avgSpeed = calculateAvgSpeed(userData.sessions);
      return badge.unlockCriteria.operator === '<' 
        ? avgSpeed < badge.unlockCriteria.value
        : avgSpeed > badge.unlockCriteria.value;
      
    case 'accuracyWithMinimum':
      const accuracy = calculateAccuracy(userData.sessions);
      const totalProblems = getTotalProblems(userData.sessions);
      return accuracy >= badge.unlockCriteria.accuracy 
        && totalProblems >= badge.unlockCriteria.minimum;
      
    case 'perfectSession':
      return userData.sessions.some(session => {
        const problems = session.problems;
        return problems.length >= badge.unlockCriteria.minimum
          && problems.every(p => p.correct);
      });
      
    case 'consecutiveDays':
      return userData.stats.currentStreak >= badge.unlockCriteria.value;
      
    case 'timeOfDay':
      return userData.sessions.some(session => {
        const hour = new Date(session.startTime).getHours();
        if (badge.unlockCriteria.before) {
          return hour < badge.unlockCriteria.before;
        }
        if (badge.unlockCriteria.after) {
          return hour >= badge.unlockCriteria.after;
        }
      });
      
    case 'topicCompletion':
      const topic = userData.topics[badge.unlockCriteria.topic];
      return topic.completionPercent >= badge.unlockCriteria.completion;
  }
}

// Check all badges after each session
function updateBadges(userId) {
  const userData = getUserData(userId);
  const newBadges = [];
  
  Object.keys(BADGES).forEach(badgeId => {
    if (!userData.badges.includes(badgeId) && checkBadgeUnlock(userId, badgeId)) {
      userData.badges.push(badgeId);
      newBadges.push(badgeId);
    }
  });
  
  if (newBadges.length > 0) {
    // Show celebration UI
    showBadgeUnlock(newBadges);
  }
  
  saveUserData(userId, userData);
}
```

---

## 📊 User Data Structure

### Complete User Object

```typescript
interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  lastLogin: string;
  
  // Profile
  profile: {
    displayName: string;
    avatar: string; // URL or emoji
    grade: number; // 6
    favoriteSubject: string;
  };
  
  // Progress across all subjects
  subjects: {
    math: MathProgress;
    kiswahili?: KiswahiliProgress; // Future
    agriculture?: AgricultureProgress; // Future
    english?: EnglishProgress; // Future
  };
  
  // Overall stats
  stats: {
    totalPracticeTime: number; // milliseconds
    totalProblems: number;
    totalCorrect: number;
    overallAccuracy: number;
    currentStreak: number;
    longestStreak: number;
    lastPracticeDate: string;
  };
  
  // Achievements
  badges: string[]; // Array of badge IDs
  points: number; // Total points from badges
  
  // Settings
  settings: {
    showVisuals: boolean;
    timerEnabled: boolean;
    soundEffects: boolean;
    darkMode: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  
  // Sessions history
  sessions: Session[];
}

interface MathProgress {
  topics: {
    addition: TopicProgress;
    subtraction: TopicProgress;
    multiplication: TopicProgress;
    division: TopicProgress;
  };
  overallCompletion: number; // 0-100
}

interface TopicProgress {
  currentLevel: number;
  completionPercent: number; // 0-100
  totalProblems: number;
  totalCorrect: number;
  accuracy: number;
  avgSpeed: number; // seconds
  lastPracticed: string;
  unlocked: boolean;
  
  // Level breakdown
  levels: {
    [level: number]: {
      completed: boolean;
      attempts: number;
      bestTime: number;
      bestAccuracy: number;
    };
  };
  
  // Speed drills specific to this topic
  speedDrills: SpeedDrill[];
}

interface Session {
  id: string;
  userId: string;
  subject: 'math' | 'kiswahili' | 'agriculture' | 'english';
  topic: string; // 'addition', 'subtraction', etc.
  mode: 'practice' | 'speed-drill' | 'regular-practice';
  level?: number;
  
  startTime: string; // ISO timestamp
  endTime: string;
  duration: number; // milliseconds
  
  problems: Problem[];
  
  // Session stats
  totalScore: number;
  accuracy: number;
  avgTime: number;
  bestStreak: number;
  hintsUsed: number;
}

interface Problem {
  question: string; // "7 + 3"
  correctAnswer: number;
  userAnswer: number;
  correct: boolean;
  timeSpent: number; // seconds
  hintsUsed: number;
  attempts: number; // How many tries before correct
}

interface SpeedDrill {
  id: string;
  date: string;
  totalTime: number; // seconds
  problemCount: number;
  accuracy: number;
  avgTimePerProblem: number;
  problems: Problem[];
}
```

---

## 🔧 API Endpoints

### User Management

```typescript
// Create user
POST /api/users/signup
Body: { username: string, password: string }
Response: { userId: string, token: string }

// Login
POST /api/users/login
Body: { username: string, password: string }
Response: { userId: string, token: string, user: User }

// Get user data
GET /api/users/:userId
Headers: { Authorization: `Bearer ${token}` }
Response: { user: User }

// Update user profile
PATCH /api/users/:userId/profile
Body: { displayName?, avatar?, favoriteSubject? }
Response: { user: User }

// Update settings
PATCH /api/users/:userId/settings
Body: { showVisuals?, timerEnabled?, etc }
Response: { settings: Settings }
```

### Session Management

```typescript
// Start session
POST /api/sessions/start
Body: {
  userId: string,
  subject: string,
  topic: string,
  mode: string,
  level?: number
}
Response: { sessionId: string }

// Save problem result
POST /api/sessions/:sessionId/problem
Body: { problem: Problem }
Response: { ok: boolean }

// End session
POST /api/sessions/:sessionId/end
Response: { 
  session: Session,
  newBadges: Badge[],
  stats: Stats
}
```

### Progress & Stats

```typescript
// Get dashboard data
GET /api/users/:userId/dashboard
Response: {
  stats: {
    totalPracticeTime: string,
    totalProblems: number,
    accuracy: number,
    currentStreak: number,
    weeklyTrend: {
      practiceTime: string,
      problems: string,
      accuracy: string
    }
  },
  charts: {
    dailyActivity: DailyActivity[],
    speedTrend: SpeedTrend[],
    topicMastery: TopicMastery[]
  },
  troubleSpots: TroubleProblem[],
  badges: Badge[],
  recentSessions: Session[]
}

// Get subject progress
GET /api/users/:userId/subjects/:subject
Response: { progress: SubjectProgress }

// Get topic progress
GET /api/users/:userId/subjects/:subject/topics/:topic
Response: { progress: TopicProgress, sessions: Session[] }
```

### Badges

```typescript
// Get all badges (locked + unlocked)
GET /api/users/:userId/badges
Response: {
  unlocked: Badge[],
  locked: Badge[],
  progress: { [badgeId: string]: number } // % toward unlock
}

// Check for new badges (called after each session)
POST /api/users/:userId/badges/check
Response: { newBadges: Badge[] }
```

---

## 💾 Cloudflare Durable Objects Structure

### UserDurableObject

```typescript
export class UserDurableObject {
  state: DurableObjectState;
  
  async fetch(request: Request) {
    const url = new URL(request.url);
    
    switch (url.pathname) {
      case '/get':
        return this.getUser();
      case '/update':
        return this.updateUser(request);
      case '/addSession':
        return this.addSession(request);
      case '/calculateStats':
        return this.calculateStats();
      case '/checkBadges':
        return this.checkBadges();
    }
  }
  
  async getUser() {
    const user = await this.state.storage.get('user');
    return new Response(JSON.stringify(user));
  }
  
  async updateUser(request: Request) {
    const updates = await request.json();
    const user = await this.state.storage.get('user');
    const updated = { ...user, ...updates };
    await this.state.storage.put('user', updated);
    return new Response(JSON.stringify(updated));
  }
  
  async addSession(request: Request) {
    const session = await request.json();
    const user = await this.state.storage.get('user');
    
    // Add session
    user.sessions.push(session);
    
    // Update stats
    user.stats = this.recalculateStats(user.sessions);
    
    // Check for new badges
    const newBadges = this.checkNewBadges(user);
    
    await this.state.storage.put('user', user);
    
    return new Response(JSON.stringify({ user, newBadges }));
  }
  
  recalculateStats(sessions: Session[]) {
    // Calculate all stats from sessions
    return {
      totalPracticeTime: sessions.reduce((sum, s) => sum + s.duration, 0),
      totalProblems: sessions.reduce((sum, s) => sum + s.problems.length, 0),
      totalCorrect: sessions.reduce((sum, s) => 
        sum + s.problems.filter(p => p.correct).length, 0
      ),
      overallAccuracy: this.calculateAccuracy(sessions),
      currentStreak: this.calculateStreak(sessions),
      longestStreak: this.calculateLongestStreak(sessions),
      lastPracticeDate: sessions[sessions.length - 1]?.endTime
    };
  }
  
  checkNewBadges(user: User): Badge[] {
    const newBadges = [];
    
    Object.keys(BADGES).forEach(badgeId => {
      if (!user.badges.includes(badgeId) && this.checkBadgeUnlock(user, badgeId)) {
        newBadges.push(BADGES[badgeId]);
        user.badges.push(badgeId);
        user.points += BADGES[badgeId].points;
      }
    });
    
    return newBadges;
  }
}
```

---

## 🚀 Implementation Steps

### Phase 1: Data Model (Day 1)

1. **Create type definitions**
   - `src/types/user.ts`
   - `src/types/session.ts`
   - `src/types/badge.ts`
   - `src/types/progress.ts`

2. **Define badge constants**
   - `src/constants/badges.ts`

3. **Create calculation utilities**
   - `src/lib/stats.ts` - All stat calculations
   - `src/lib/badges.ts` - Badge unlock logic

### Phase 2: Backend (Day 2-3)

1. **Update Durable Objects**
   - Implement new data structure
   - Add stat calculation methods
   - Add badge checking

2. **Create API endpoints**
   - Dashboard endpoint
   - Progress endpoints
   - Badge endpoints

3. **Test with mock data**
   - Create seed data
   - Test all calculations

### Phase 3: Frontend (Day 4-5)

1. **Build dashboard components**
   - Use Tremor for charts
   - Follow PROMPT-9 design

2. **Connect to API**
   - Fetch dashboard data
   - Update in real-time

3. **Add badge celebration UI**
   - Confetti on unlock
   - Badge modal

### Phase 4: Testing (Day 6)

1. **Test calculations**
   - Verify all KPIs accurate
   - Test badge unlocks

2. **Test UI**
   - All charts render
   - Data updates correctly

---

## 📋 Quick Reference Checklist

**Data Structure**:
- [ ] User type defined
- [ ] Session type defined
- [ ] Badge constants created
- [ ] Progress types defined

**Calculations**:
- [ ] Practice time calculation
- [ ] Problems count
- [ ] Accuracy rate
- [ ] Streak calculation
- [ ] Speed calculation
- [ ] Improvement rate

**Badges**:
- [ ] All 20+ badges defined
- [ ] Unlock criteria implemented
- [ ] Check logic works
- [ ] Points system set up

**Backend**:
- [ ] Durable Objects updated
- [ ] API endpoints created
- [ ] Stats recalculation on session end
- [ ] Badge checking automated

**Frontend**:
- [ ] Dashboard fetches data
- [ ] Charts display correctly
- [ ] Badges show unlock state
- [ ] Real-time updates work

---

This is your complete system. Start with Phase 1 (data model), then move to backend, then UI. Everything is defined here!