# Lumio Dashboard System Design - Complete Architecture

## 🎯 Overview

This document defines the **complete system** behind Lumio's dashboard:
- Data models and storage
- KPI definitions and calculations
- Badge/achievement system
- User progress tracking
- API endpoints
- Future scalability (non-math subjects)

---

## 📊 Part 1: KPI Cards (Top Stats)

### Card 1: Total Practice Time ⏱️

**What it tracks**: Cumulative time spent solving problems

**Data source**:
```typescript
interface Session {
  id: string;
  userId: string;
  subject: 'math' | 'kiswahili' | 'agriculture' | 'english';
  topic: string; // e.g., 'addition', 'subtraction'
  mode: 'practice' | 'lightning-round';
  startTime: Date;
  endTime: Date;
  totalTime: number; // in seconds
}

// Calculation
const totalPracticeTime = sessions.reduce((sum, s) => sum + s.totalTime, 0);
```

**Display format**:
- < 60 min: "45m"
- 60-119 min: "1h 15m"
- 2+ hours: "2h 45m"

**Trend calculation**:
```typescript
const thisWeekTime = getSessionsThisWeek().reduce((sum, s) => sum + s.totalTime, 0);
const lastWeekTime = getSessionsLastWeek().reduce((sum, s) => sum + s.totalTime, 0);
const trend = ((thisWeekTime - lastWeekTime) / lastWeekTime * 100).toFixed(0);
// Display: "+12% this week" or "-5% this week"
```

---

### Card 2: Problems Solved 🎯

**What it tracks**: Total number of problems attempted (all subjects)

**Data source**:
```typescript
interface Problem {
  id: string;
  sessionId: string;
  subject: string;
  topic: string;
  question: string; // e.g., "7 + 3"
  correctAnswer: number;
  userAnswer: number;
  correct: boolean;
  timeSpent: number; // in seconds
  hintsUsed: number;
  timestamp: Date;
}

// Calculation
const totalProblems = problems.length;
const thisWeekProblems = problems.filter(p => isThisWeek(p.timestamp)).length;
```

**Breakdown by subject** (future):
```typescript
const problemsBySubject = {
  math: problems.filter(p => p.subject === 'math').length,
  kiswahili: problems.filter(p => p.subject === 'kiswahili').length,
  // ... etc
};
```

---

### Card 3: Overall Accuracy 📈

**What it tracks**: Percentage of problems answered correctly (all time)

**Data source**:
```typescript
const correctProblems = problems.filter(p => p.correct).length;
const totalProblems = problems.length;
const accuracy = (correctProblems / totalProblems * 100).toFixed(0);
```

**Subject-specific accuracy** (for drill-down):
```typescript
const mathAccuracy = calculateAccuracy(problems.filter(p => p.subject === 'math'));
const kiswahiliAccuracy = calculateAccuracy(problems.filter(p => p.subject === 'kiswahili'));
```

**Trend**:
```typescript
const thisWeekAccuracy = calculateAccuracy(getProblemsThisWeek());
const lastWeekAccuracy = calculateAccuracy(getProblemsLastWeek());
const trend = (thisWeekAccuracy - lastWeekAccuracy).toFixed(0);
```

---

### Card 4: Current Streak 🔥

**What it tracks**: Consecutive days with at least 1 practice session

**Data source**:
```typescript
interface Streak {
  userId: string;
  current: number; // current streak in days
  longest: number; // longest streak ever
  lastPracticeDate: Date;
}

// Calculation
function calculateStreak(sessions: Session[]): number {
  const sortedDates = sessions
    .map(s => s.startTime.toDateString())
    .filter((date, i, arr) => arr.indexOf(date) === i) // unique dates
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // newest first

  let streak = 0;
  let checkDate = new Date();
  
  for (const date of sortedDates) {
    const sessionDate = new Date(date);
    const diffDays = Math.floor((checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
```

**Status**:
- Active (practiced today): "Active 🔥"
- At risk (last practice yesterday): "Keep it going! 💪"
- Broken (no practice 2+ days): "Start a new streak! 🚀"

---

## 🏆 Part 2: Badge/Achievement System

### Achievement Categories

**1. Milestone Badges** (One-time unlocks)

```typescript
const milestoneAchievements = [
  {
    id: 'first_steps',
    name: 'First Steps',
    emoji: '👣',
    description: 'Solved your first 10 problems',
    criteria: { totalProblems: 10 },
    points: 50
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    emoji: '🌱',
    description: 'Completed first practice session',
    criteria: { sessions: 1 },
    points: 25
  },
  {
    id: 'century_club',
    name: 'Century Club',
    emoji: '💯',
    description: 'Solved 100 problems',
    criteria: { totalProblems: 100 },
    points: 200
  },
  {
    id: 'half_thousand',
    name: 'Half Thousand',
    emoji: '🎉',
    description: 'Solved 500 problems',
    criteria: { totalProblems: 500 },
    points: 500
  },
  {
    id: 'math_master',
    name: 'Math Master',
    emoji: '🎓',
    description: 'Completed all 4 math operations',
    criteria: { 
      topics: ['addition', 'subtraction', 'multiplication', 'division'],
      completionPercent: 100 
    },
    points: 1000
  }
];
```

**2. Performance Badges** (Skill-based)

```typescript
const performanceAchievements = [
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    emoji: '⚡',
    description: 'Average time under 5 seconds (50 problems)',
    criteria: { 
      minProblems: 50,
      maxAvgTime: 5 
    },
    points: 300
  },
  {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    emoji: '⚡⚡',
    description: 'Average time under 3 seconds (50 problems)',
    criteria: { 
      minProblems: 50,
      maxAvgTime: 3 
    },
    points: 500
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    emoji: '✨',
    description: '100% accuracy on 50 consecutive problems',
    criteria: { 
      consecutiveCorrect: 50 
    },
    points: 400
  },
  {
    id: 'ace_student',
    name: 'Ace Student',
    emoji: '🌟',
    description: '95% accuracy across 100 problems',
    criteria: { 
      minProblems: 100,
      minAccuracy: 95 
    },
    points: 350
  }
];
```

**3. Streak Badges** (Consistency)

```typescript
const streakAchievements = [
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    emoji: '🔥',
    description: '7-day practice streak',
    criteria: { streak: 7 },
    points: 150
  },
  {
    id: 'two_week_champion',
    name: 'Two Week Champion',
    emoji: '🔥🔥',
    description: '14-day practice streak',
    criteria: { streak: 14 },
    points: 300
  },
  {
    id: 'month_master',
    name: 'Month Master',
    emoji: '🔥🔥🔥',
    description: '30-day practice streak',
    criteria: { streak: 30 },
    points: 750
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    emoji: '🚀',
    description: '60-day practice streak',
    criteria: { streak: 60 },
    points: 1500
  }
];
```

**4. Subject-Specific Badges** (Future)

```typescript
const subjectAchievements = [
  // Math
  {
    id: 'addition_ace',
    name: 'Addition Ace',
    emoji: '➕',
    description: 'Master all addition levels',
    subject: 'math',
    criteria: { topic: 'addition', mastery: 100 },
    points: 200
  },
  // Kiswahili (Future)
  {
    id: 'swahili_speaker',
    name: 'Swahili Speaker',
    emoji: '🗣️',
    description: 'Complete 50 Kiswahili exercises',
    subject: 'kiswahili',
    criteria: { totalProblems: 50 },
    points: 200
  },
  // Agriculture (Future)
  {
    id: 'green_thumb',
    name: 'Green Thumb',
    emoji: '🌾',
    description: 'Complete farming basics module',
    subject: 'agriculture',
    criteria: { module: 'farming_basics', completion: 100 },
    points: 200
  }
];
```

---

### Achievement Tracking System

```typescript
interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  notified: boolean; // Has user been shown the unlock notification?
}

interface AchievementProgress {
  userId: string;
  achievementId: string;
  currentValue: number; // e.g., current streak is 5, target is 7
  targetValue: number;
  percentage: number; // currentValue / targetValue * 100
}

// Check if achievement should unlock
function checkAchievements(userId: string) {
  const userStats = getUserStats(userId);
  const unlockedAchievements = getUserAchievements(userId);
  const newUnlocks: Achievement[] = [];

  for (const achievement of allAchievements) {
    // Skip if already unlocked
    if (unlockedAchievements.find(a => a.achievementId === achievement.id)) {
      continue;
    }

    // Check criteria
    if (meetsAchievementCriteria(achievement, userStats)) {
      unlockAchievement(userId, achievement.id);
      newUnlocks.push(achievement);
    }
  }

  return newUnlocks;
}

// Run after every session
async function onSessionComplete(sessionId: string) {
  const session = await getSession(sessionId);
  const newAchievements = checkAchievements(session.userId);
  
  if (newAchievements.length > 0) {
    // Show celebration modal/toast
    showAchievementUnlock(newAchievements);
  }
}
```

---

## 📈 Part 3: Charts & Visualizations

### 1. Activity Heatmap (Last 90 Days)

**Data model**:
```typescript
interface DayActivity {
  date: string; // 'YYYY-MM-DD'
  problemCount: number;
  practiceTime: number; // in seconds
  subjects: Set<string>; // which subjects practiced
}

// Generate data
function generateActivityHeatmap(userId: string, days: number = 90): DayActivity[] {
  const heatmap: DayActivity[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayProblems = problems.filter(p => 
      p.userId === userId && 
      p.timestamp.toISOString().split('T')[0] === dateStr
    );

    heatmap.push({
      date: dateStr,
      problemCount: dayProblems.length,
      practiceTime: dayProblems.reduce((sum, p) => sum + p.timeSpent, 0),
      subjects: new Set(dayProblems.map(p => p.subject))
    });
  }

  return heatmap;
}
```

---

### 2. Performance Radar Chart

**Metrics**:
```typescript
interface PerformanceMetrics {
  speed: number; // 0-100, based on avg time vs. benchmark
  accuracy: number; // 0-100, percentage correct
  consistency: number; // 0-100, based on streak and practice frequency
  problemSolving: number; // 0-100, based on hard problem success rate
  mentalMath: number; // 0-100, based on no-hint usage
}

function calculatePerformanceMetrics(userId: string): PerformanceMetrics {
  const userProblems = problems.filter(p => p.userId === userId);
  
  // Speed (benchmark: 10s is 0, 2s is 100)
  const avgTime = userProblems.reduce((sum, p) => sum + p.timeSpent, 0) / userProblems.length;
  const speed = Math.max(0, Math.min(100, (10 - avgTime) / 8 * 100));
  
  // Accuracy
  const accuracy = (userProblems.filter(p => p.correct).length / userProblems.length) * 100;
  
  // Consistency (based on streak and practice frequency)
  const streak = getCurrentStreak(userId);
  const practiceFrequency = calculatePracticeFrequency(userId); // days per week
  const consistency = (streak / 30 * 50) + (practiceFrequency / 7 * 50);
  
  // Problem Solving (% of hard problems solved)
  const hardProblems = userProblems.filter(p => isHardProblem(p));
  const problemSolving = (hardProblems.filter(p => p.correct).length / hardProblems.length) * 100;
  
  // Mental Math (% solved without hints)
  const noHintProblems = userProblems.filter(p => p.hintsUsed === 0);
  const mentalMath = (noHintProblems.length / userProblems.length) * 100;
  
  return { speed, accuracy, consistency, problemSolving, mentalMath };
}
```

---

### 3. Speed Improvement Trend

**Data model**:
```typescript
interface SpeedSession {
  sessionNumber: number;
  date: Date;
  avgTime: number;
  accuracy: number;
  problemCount: number;
}

function getSpeedTrend(userId: string, limit: number = 10): SpeedSession[] {
  const sessions = getSessions(userId)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(-limit);

  return sessions.map((session, i) => {
    const sessionProblems = problems.filter(p => p.sessionId === session.id);
    const avgTime = sessionProblems.reduce((sum, p) => sum + p.timeSpent, 0) / sessionProblems.length;
    const accuracy = (sessionProblems.filter(p => p.correct).length / sessionProblems.length) * 100;

    return {
      sessionNumber: i + 1,
      date: session.startTime,
      avgTime,
      accuracy,
      problemCount: sessionProblems.length
    };
  });
}
```

---

### 4. Topic Mastery (Circular Progress)

**Mastery calculation**:
```typescript
interface TopicMastery {
  topic: string;
  subject: string;
  completionPercent: number; // 0-100
  currentLevel: number;
  totalLevels: number;
  accuracy: number;
  avgTime: number;
  problemsSolved: number;
}

function calculateTopicMastery(userId: string, subject: string, topic: string): TopicMastery {
  const topicProblems = problems.filter(p => 
    p.userId === userId && 
    p.subject === subject && 
    p.topic === topic
  );

  const topicConfig = getTopicConfig(subject, topic); // Gets level structure
  
  // Determine current level based on problems solved
  const currentLevel = Math.min(
    topicConfig.levels,
    Math.floor(topicProblems.length / 20) + 1
  );

  // Completion based on levels completed
  const completionPercent = (currentLevel / topicConfig.levels) * 100;

  const accuracy = (topicProblems.filter(p => p.correct).length / topicProblems.length) * 100;
  const avgTime = topicProblems.reduce((sum, p) => sum + p.timeSpent, 0) / topicProblems.length;

  return {
    topic,
    subject,
    completionPercent,
    currentLevel,
    totalLevels: topicConfig.levels,
    accuracy,
    avgTime,
    problemsSolved: topicProblems.length
  };
}
```

---

## 🗄️ Part 4: Data Storage Architecture

### Cloudflare Durable Objects Structure

```typescript
// User Durable Object
class UserDurableObject {
  state: DurableObjectState;

  async fetch(request: Request) {
    const url = new URL(request.url);
    
    switch (url.pathname) {
      case '/profile':
        return this.getProfile();
      case '/stats':
        return this.getStats();
      case '/update-streak':
        return this.updateStreak();
    }
  }

  async getProfile() {
    const profile = await this.state.storage.get('profile');
    return new Response(JSON.stringify(profile));
  }

  async getStats() {
    const sessions = await this.state.storage.get('sessions') || [];
    const problems = await this.state.storage.get('problems') || [];
    
    const stats = {
      totalTime: sessions.reduce((sum, s) => sum + s.totalTime, 0),
      totalProblems: problems.length,
      accuracy: this.calculateAccuracy(problems),
      streak: this.calculateStreak(sessions)
    };

    return new Response(JSON.stringify(stats));
  }
}

// Progress Durable Object (per subject/topic)
class ProgressDurableObject {
  state: DurableObjectState;

  async saveProblem(problem: Problem) {
    const problems = await this.state.storage.get('problems') || [];
    problems.push(problem);
    await this.state.storage.put('problems', problems);

    // Update aggregated stats
    await this.updateStats(problem);
  }

  async updateStats(problem: Problem) {
    const stats = await this.state.storage.get('stats') || {
      totalProblems: 0,
      correctProblems: 0,
      totalTime: 0
    };

    stats.totalProblems++;
    if (problem.correct) stats.correctProblems++;
    stats.totalTime += problem.timeSpent;

    await this.state.storage.put('stats', stats);
  }
}
```

---

### Storage Keys Structure

```typescript
// User profile
`user:${userId}:profile` = {
  id: string,
  username: string,
  createdAt: Date,
  settings: UserSettings
}

// Sessions
`user:${userId}:sessions` = Session[]

// Problems (by subject/topic for faster queries)
`user:${userId}:${subject}:${topic}:problems` = Problem[]

// Achievements
`user:${userId}:achievements` = UserAchievement[]

// Streak data
`user:${userId}:streak` = Streak

// Topic mastery
`user:${userId}:${subject}:${topic}:mastery` = TopicMastery

// Aggregated stats (cached for performance)
`user:${userId}:stats:cached` = {
  totalTime: number,
  totalProblems: number,
  accuracy: number,
  lastUpdated: Date
}
```

---

## 🔌 Part 5: API Endpoints

### Dashboard Data API

```typescript
// GET /api/dashboard/:userId
// Returns all dashboard data in one call
interface DashboardResponse {
  kpis: {
    totalTime: string;
    totalProblems: number;
    accuracy: number;
    streak: number;
  };
  charts: {
    activityHeatmap: DayActivity[];
    performanceRadar: PerformanceMetrics;
    speedTrend: SpeedSession[];
    topicMastery: TopicMastery[];
  };
  achievements: {
    unlocked: Achievement[];
    locked: Achievement[];
    recentUnlocks: Achievement[];
  };
  troubleSpots: TroubleProblem[];
  aiInsights: AIInsight[];
}

// Implementation
export async function getDashboardData(userId: string): Promise<DashboardResponse> {
  // Fetch all data in parallel
  const [sessions, problems, achievements, streak] = await Promise.all([
    getUserSessions(userId),
    getUserProblems(userId),
    getUserAchievements(userId),
    getUserStreak(userId)
  ]);

  // Calculate KPIs
  const kpis = calculateKPIs(sessions, problems, streak);
  
  // Generate charts
  const charts = {
    activityHeatmap: generateActivityHeatmap(userId),
    performanceRadar: calculatePerformanceMetrics(userId),
    speedTrend: getSpeedTrend(userId),
    topicMastery: getAllTopicMastery(userId)
  };

  // Get achievements
  const allAchievements = [...milestoneAchievements, ...performanceAchievements, ...streakAchievements];
  const unlockedIds = achievements.map(a => a.achievementId);
  
  const achievementsData = {
    unlocked: allAchievements.filter(a => unlockedIds.includes(a.id)),
    locked: allAchievements.filter(a => !unlockedIds.includes(a.id)),
    recentUnlocks: achievements
      .filter(a => isRecent(a.unlockedAt))
      .map(a => allAchievements.find(ach => ach.id === a.achievementId))
  };

  // Identify trouble spots
  const troubleSpots = identifyTroubleSpots(problems);

  // Generate AI insights (future)
  const aiInsights = await generateAIInsights(userId, sessions, problems);

  return {
    kpis,
    charts,
    achievements: achievementsData,
    troubleSpots,
    aiInsights
  };
}
```

---

### Session Recording API

```typescript
// POST /api/session/complete
// Called when a practice session ends
interface SessionCompleteRequest {
  userId: string;
  subject: string;
  topic: string;
  mode: 'practice' | 'lightning-round';
  startTime: Date;
  endTime: Date;
  problems: Problem[];
}

export async function completeSession(data: SessionCompleteRequest) {
  // 1. Save session
  const session: Session = {
    id: generateId(),
    userId: data.userId,
    subject: data.subject,
    topic: data.topic,
    mode: data.mode,
    startTime: data.startTime,
    endTime: data.endTime,
    totalTime: (data.endTime.getTime() - data.startTime.getTime()) / 1000
  };
  await saveSession(session);

  // 2. Save individual problems
  for (const problem of data.problems) {
    await saveProblem({
      ...problem,
      sessionId: session.id,
      userId: data.userId,
      subject: data.subject,
      topic: data.topic
    });
  }

  // 3. Update streak
  await updateStreak(data.userId);

  // 4. Check for new achievements
  const newAchievements = await checkAchievements(data.userId);

  // 5. Update cached stats
  await updateCachedStats(data.userId);

  return {
    sessionId: session.id,
    newAchievements,
    updatedStats: await getUserStats(data.userId)
  };
}
```

---

## 🤖 Part 6: AI Insights System (Future)

### Insight Categories

```typescript
interface AIInsight {
  id: string;
  type: 'strength' | 'opportunity' | 'milestone' | 'tip';
  emoji: string;
  title: string;
  description: string;
  actionable?: {
    label: string;
    action: string; // e.g., 'practice:addition:hard'
  };
  priority: number; // 1-5, higher = show first
}

// Generate insights
function generateAIInsights(userId: string, sessions: Session[], problems: Problem[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // Pattern recognition
  const patterns = analyzePatterns(problems);
  if (patterns.strongPatterns.length > 0) {
    insights.push({
      id: 'pattern_strength',
      type: 'strength',
      emoji: '💪',
      title: 'Strong Pattern Recognition',
      description: `You excel at problems like ${patterns.strongPatterns.join(', ')}. Keep it up!`,
      priority: 3
    });
  }

  // Speed analysis
  const slowProblems = identifySlowProblems(problems);
  if (slowProblems.length > 0) {
    insights.push({
      id: 'speed_opportunity',
      type: 'opportunity',
      emoji: '🎯',
      title: 'Practice for Speed',
      description: `Problems like ${slowProblems[0].pattern} take longer. Try the "making tens" strategy!`,
      actionable: {
        label: 'Practice These',
        action: 'practice:addition:making-tens'
      },
      priority: 4
    });
  }

  // Milestones
  if (problems.length === 100) {
    insights.push({
      id: 'milestone_100',
      type: 'milestone',
      emoji: '🏆',
      title: 'Milestone Reached!',
      description: 'You solved 100 problems - that\'s amazing progress!',
      priority: 5
    });
  }

  return insights.sort((a, b) => b.priority - a.priority);
}
```

---

## 🔮 Part 7: Future Scalability (Non-Math Subjects)

### Subject Configuration System

```typescript
interface SubjectConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  topics: TopicConfig[];
}

interface TopicConfig {
  id: string;
  name: string;
  description: string;
  levels: number;
  problemTypes: ProblemType[];
}

// Math config (current)
const mathConfig: SubjectConfig = {
  id: 'math',
  name: 'Mathematics',
  icon: '➕',
  color: '#3b82f6',
  topics: [
    {
      id: 'addition',
      name: 'Addition',
      description: 'Add numbers together',
      levels: 10,
      problemTypes: ['basic', 'carrying', 'word-problems']
    },
    // ... subtraction, multiplication, division
  ]
};

// Kiswahili config (future)
const kiswahiliConfig: SubjectConfig = {
  id: 'kiswahili',
  name: 'Kiswahili',
  icon: '🗣️',
  color: '#ec4899',
  topics: [
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      description: 'Learn common Swahili words',
      levels: 10,
      problemTypes: ['translation', 'matching', 'fill-blank']
    },
    {
      id: 'grammar',
      name: 'Grammar',
      description: 'Sentence structure and rules',
      levels: 8,
      problemTypes: ['sentence-correction', 'conjugation']
    }
  ]
};

// Make all stats subject-agnostic
function getSubjectStats(userId: string, subjectId: string) {
  // Same structure for all subjects
  const problems = problems.filter(p => p.subject === subjectId);
  return calculateStats(problems);
}
```

---

## 📋 Implementation Checklist

### Phase 1: Data Models (Day 1)
- [ ] Define TypeScript interfaces for all data models
- [ ] Create Durable Object classes
- [ ] Set up storage key structure
- [ ] Write helper functions for calculations

### Phase 2: API Endpoints (Day 2)
- [ ] Create `/api/dashboard/:userId` endpoint
- [ ] Create `/api/session/complete` endpoint
- [ ] Create `/api/achievements/:userId` endpoint
- [ ] Test all endpoints with mock data

### Phase 3: Achievement System (Day 3)
- [ ] Define all achievements
- [ ] Write achievement checking logic
- [ ] Create unlock notification system
- [ ] Test achievement triggers

### Phase 4: Dashboard Components (Day 4-5)
- [ ] Build KPI cards with real data
- [ ] Implement activity heatmap
- [ ] Create performance radar chart
- [ ] Add speed trend visualization
- [ ] Build topic mastery circles
- [ ] Create achievements showcase

### Phase 5: Testing & Polish (Day 6)
- [ ] Test with real user data
- [ ] Verify calculations are accurate
- [ ] Check performance with large datasets
- [ ] Add loading states
- [ ] Handle edge cases (new users, no data)

---

## 🎯 Success Metrics

**Data Accuracy**:
- KPIs match raw data
- Achievements unlock correctly
- Trends show actual improvement

**Performance**:
- Dashboard loads in < 1 second
- API responses < 500ms
- No N+1 queries

**User Experience**:
- Clear what each metric means
- Achievements feel rewarding
- Data motivates practice

---

This system is **fully scalable** to any subject and provides a **solid foundation** for Lumio's dashboard!