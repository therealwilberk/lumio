# Dashboard Implementation Guide - Wire It All Together

## 🎯 Overview

This guide shows you **exactly how to connect** the dashboard UI to your Cloudflare Workers backend with real code examples.

---

## 📁 File Structure

```
lumio/
├── src/
│   ├── pages/
│   │   └── DashboardPage.tsx         # Main dashboard
│   ├── components/
│   │   └── dashboard/
│   │       ├── StatCard.tsx          # KPI cards
│   │       ├── ActivityHeatmap.tsx   # 90-day heatmap
│   │       ├── PerformanceRadar.tsx  # Skills radar
│   │       ├── SpeedTrend.tsx        # Speed improvement
│   │       ├── TopicMastery.tsx      # Circular progress
│   │       ├── AchievementsGrid.tsx  # Badge showcase
│   │       └── TroubleSpots.tsx      # Problem areas
│   ├── lib/
│   │   ├── api.ts                    # API client
│   │   ├── calculations.ts           # Stats calculations
│   │   └── achievements.ts           # Achievement definitions
│   └── types/
│       └── dashboard.ts              # TypeScript types
├── worker/
│   ├── routes/
│   │   ├── dashboard.ts              # Dashboard API
│   │   ├── session.ts                # Session recording
│   │   └── achievements.ts           # Achievement checks
│   └── entities/
│       ├── UserDurableObject.ts      # User data storage
│       └── ProgressDurableObject.ts  # Progress tracking
└── shared/
    └── types.ts                      # Shared types
```

---

## 🔧 Step 1: Define Shared Types

### File: `shared/types.ts`

```typescript
// ===== USER & AUTH =====
export interface User {
  id: string;
  username: string;
  createdAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  showVisuals: boolean;
  timerEnabled: boolean;
  soundEffects: boolean;
  theme: 'light' | 'dark';
}

// ===== SESSION & PROBLEMS =====
export interface Session {
  id: string;
  userId: string;
  subject: 'math' | 'kiswahili' | 'agriculture' | 'english';
  topic: string;
  mode: 'practice' | 'lightning-round';
  startTime: Date;
  endTime: Date;
  totalTime: number; // seconds
}

export interface Problem {
  id: string;
  sessionId: string;
  userId: string;
  subject: string;
  topic: string;
  question: string;
  correctAnswer: number;
  userAnswer: number;
  correct: boolean;
  timeSpent: number; // seconds
  hintsUsed: number;
  timestamp: Date;
}

// ===== ACHIEVEMENTS =====
export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: 'milestone' | 'performance' | 'streak' | 'subject';
  criteria: AchievementCriteria;
  points: number;
}

export interface AchievementCriteria {
  totalProblems?: number;
  consecutiveCorrect?: number;
  minAccuracy?: number;
  maxAvgTime?: number;
  streak?: number;
  topic?: string;
  completionPercent?: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  notified: boolean;
}

// ===== DASHBOARD DATA =====
export interface DashboardData {
  kpis: {
    totalTime: number;
    totalProblems: number;
    accuracy: number;
    streak: number;
    trends: {
      time: number;
      problems: number;
      accuracy: number;
    };
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
    progress: AchievementProgress[];
  };
  troubleSpots: TroubleProblem[];
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  problemCount: number;
  practiceTime: number;
  subjects: string[];
}

export interface PerformanceMetrics {
  speed: number; // 0-100
  accuracy: number; // 0-100
  consistency: number; // 0-100
  problemSolving: number; // 0-100
  mentalMath: number; // 0-100
}

export interface SpeedSession {
  sessionNumber: number;
  date: Date;
  avgTime: number;
  accuracy: number;
  problemCount: number;
}

export interface TopicMastery {
  topic: string;
  subject: string;
  completionPercent: number;
  currentLevel: number;
  totalLevels: number;
  accuracy: number;
  avgTime: number;
  problemsSolved: number;
}

export interface TroubleProblem {
  problem: string;
  failures: number;
  attempts: number;
  failureRate: number;
  avgTime: number;
}

export interface AchievementProgress {
  achievementId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
}
```

---

## 🎨 Step 2: Create Achievement Definitions

### File: `src/lib/achievements.ts`

```typescript
import { Achievement } from '@/types/dashboard';

export const ACHIEVEMENTS: Achievement[] = [
  // MILESTONE ACHIEVEMENTS
  {
    id: 'first_steps',
    name: 'First Steps',
    emoji: '👣',
    description: 'Solved your first 10 problems',
    category: 'milestone',
    criteria: { totalProblems: 10 },
    points: 50
  },
  {
    id: 'century_club',
    name: 'Century Club',
    emoji: '💯',
    description: 'Solved 100 problems',
    category: 'milestone',
    criteria: { totalProblems: 100 },
    points: 200
  },
  {
    id: 'half_thousand',
    name: 'Half Thousand',
    emoji: '🎉',
    description: 'Solved 500 problems',
    category: 'milestone',
    criteria: { totalProblems: 500 },
    points: 500
  },

  // PERFORMANCE ACHIEVEMENTS
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    emoji: '⚡',
    description: 'Average under 5 seconds (50 problems)',
    category: 'performance',
    criteria: { 
      totalProblems: 50,
      maxAvgTime: 5 
    },
    points: 300
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    emoji: '✨',
    description: '100% accuracy on 50 problems in a row',
    category: 'performance',
    criteria: { consecutiveCorrect: 50 },
    points: 400
  },
  {
    id: 'ace_student',
    name: 'Ace Student',
    emoji: '🌟',
    description: '95% accuracy across 100 problems',
    category: 'performance',
    criteria: { 
      totalProblems: 100,
      minAccuracy: 95 
    },
    points: 350
  },

  // STREAK ACHIEVEMENTS
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    emoji: '🔥',
    description: '7-day practice streak',
    category: 'streak',
    criteria: { streak: 7 },
    points: 150
  },
  {
    id: 'two_week_champion',
    name: 'Two Week Champion',
    emoji: '🔥🔥',
    description: '14-day practice streak',
    category: 'streak',
    criteria: { streak: 14 },
    points: 300
  },
  {
    id: 'month_master',
    name: 'Month Master',
    emoji: '🔥🔥🔥',
    description: '30-day practice streak',
    category: 'streak',
    criteria: { streak: 30 },
    points: 750
  },

  // SUBJECT ACHIEVEMENTS
  {
    id: 'addition_ace',
    name: 'Addition Ace',
    emoji: '➕',
    description: 'Completed all addition levels',
    category: 'subject',
    criteria: { 
      topic: 'addition',
      completionPercent: 100 
    },
    points: 200
  },
  {
    id: 'math_master',
    name: 'Math Master',
    emoji: '🎓',
    description: 'Completed all 4 math operations',
    category: 'subject',
    criteria: { 
      completionPercent: 100 
    },
    points: 1000
  }
];

// Helper to get achievement by ID
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

// Helper to check if achievement criteria is met
export function meetsAchievementCriteria(
  achievement: Achievement,
  userStats: any
): boolean {
  const { criteria } = achievement;

  if (criteria.totalProblems !== undefined) {
    if (userStats.totalProblems < criteria.totalProblems) return false;
  }

  if (criteria.minAccuracy !== undefined) {
    if (userStats.accuracy < criteria.minAccuracy) return false;
  }

  if (criteria.maxAvgTime !== undefined) {
    if (userStats.avgTime > criteria.maxAvgTime) return false;
  }

  if (criteria.streak !== undefined) {
    if (userStats.currentStreak < criteria.streak) return false;
  }

  if (criteria.consecutiveCorrect !== undefined) {
    if (userStats.maxConsecutiveCorrect < criteria.consecutiveCorrect) return false;
  }

  if (criteria.topic !== undefined) {
    const topicMastery = userStats.topicMastery.find(t => t.topic === criteria.topic);
    if (!topicMastery || topicMastery.completionPercent < (criteria.completionPercent || 100)) {
      return false;
    }
  }

  return true;
}
```

---

## 🔌 Step 3: Create API Client

### File: `src/lib/api.ts`

```typescript
import { DashboardData, Session, Problem } from '@/types/dashboard';

const API_BASE = '/api';

// Fetch dashboard data
export async function getDashboardData(userId: string): Promise<DashboardData> {
  const response = await fetch(`${API_BASE}/dashboard/${userId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
  }

  return response.json();
}

// Complete a practice session
export async function completeSession(data: {
  userId: string;
  subject: string;
  topic: string;
  mode: 'practice' | 'lightning-round';
  startTime: Date;
  endTime: Date;
  problems: Problem[];
}): Promise<{
  sessionId: string;
  newAchievements: string[];
  updatedStats: any;
}> {
  const response = await fetch(`${API_BASE}/session/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to complete session: ${response.statusText}`);
  }

  return response.json();
}

// Get user achievements
export async function getUserAchievements(userId: string) {
  const response = await fetch(`${API_BASE}/achievements/${userId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch achievements: ${response.statusText}`);
  }

  return response.json();
}
```

---

## 🎨 Step 4: Create Dashboard Page

### File: `src/pages/DashboardPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardData } from '@/lib/api';
import { DashboardData } from '@/types/dashboard';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { PerformanceRadar } from '@/components/dashboard/PerformanceRadar';
import { SpeedTrend } from '@/components/dashboard/SpeedTrend';
import { TopicMastery } from '@/components/dashboard/TopicMastery';
import { AchievementsGrid } from '@/components/dashboard/AchievementsGrid';
import { TroubleSpots } from '@/components/dashboard/TroubleSpots';
import { Clock, Target, TrendingUp, Flame } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        setLoading(true);
        const dashboardData = await getDashboardData(user.id);
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardError error={error} />;
  }

  if (!data) {
    return <EmptyDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Learning Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Welcome back, {user?.username}! You've been crushing it! 🎉
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Practice Time"
            value={formatTime(data.kpis.totalTime)}
            trend={`${data.kpis.trends.time > 0 ? '+' : ''}${data.kpis.trends.time}% this week`}
            trendUp={data.kpis.trends.time > 0}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Problems Solved"
            value={data.kpis.totalProblems.toString()}
            trend={`${data.kpis.trends.problems > 0 ? '+' : ''}${data.kpis.trends.problems}% this week`}
            trendUp={data.kpis.trends.problems > 0}
            icon={Target}
            color="purple"
          />
          <StatCard
            title="Accuracy Rate"
            value={`${data.kpis.accuracy}%`}
            trend={`${data.kpis.trends.accuracy > 0 ? '+' : ''}${data.kpis.trends.accuracy}% this week`}
            trendUp={data.kpis.trends.accuracy > 0}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Current Streak"
            value={`${data.kpis.streak} days`}
            trend="Active 🔥"
            trendUp={true}
            icon={Flame}
            color="orange"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ActivityHeatmap data={data.charts.activityHeatmap} />
          <PerformanceRadar data={data.charts.performanceRadar} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SpeedTrend data={data.charts.speedTrend} />
          <TopicMastery data={data.charts.topicMastery} />
        </div>

        {/* Achievements & Trouble Spots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AchievementsGrid 
            unlocked={data.achievements.unlocked}
            locked={data.achievements.locked}
            progress={data.achievements.progress}
          />
          <TroubleSpots problems={data.troubleSpots} />
        </div>
      </div>
    </div>
  );
}

// Helper function
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-1/3 mb-8" />
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardError({ error }: { error: string }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-500 text-white rounded-xl"
      >
        Try Again
      </button>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🚀</div>
      <h2 className="text-2xl font-bold mb-2">Start Your Learning Journey!</h2>
      <p className="text-gray-600 mb-6">
        Complete your first practice session to see your stats here.
      </p>
      <a 
        href="/math"
        className="inline-block px-6 py-3 bg-blue-500 text-white rounded-xl"
      >
        Start Practicing
      </a>
    </div>
  );
}
```

---

## 🖥️ Step 5: Create Worker Endpoints

### File: `worker/routes/dashboard.ts`

```typescript
import { Hono } from 'hono';
import { DashboardData } from '../../shared/types';

const dashboard = new Hono();

dashboard.get('/:userId', async (c) => {
  const userId = c.req.param('userId');
  
  try {
    // Get Durable Object instance
    const id = c.env.USER_DO.idFromName(userId);
    const stub = c.env.USER_DO.get(id);
    
    // Fetch all data
    const [sessions, problems, achievements, streak] = await Promise.all([
      stub.getSessions(),
      stub.getProblems(),
      stub.getAchievements(),
      stub.getStreak()
    ]);

    // Calculate KPIs
    const kpis = calculateKPIs(sessions, problems, streak);
    
    // Generate charts
    const charts = {
      activityHeatmap: generateActivityHeatmap(problems),
      performanceRadar: calculatePerformanceMetrics(problems),
      speedTrend: calculateSpeedTrend(sessions, problems),
      topicMastery: calculateTopicMastery(problems)
    };

    // Process achievements
    const achievementsData = processAchievements(achievements);

    // Identify trouble spots
    const troubleSpots = identifyTroubleSpots(problems);

    const dashboardData: DashboardData = {
      kpis,
      charts,
      achievements: achievementsData,
      troubleSpots
    };

    return c.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    return c.json({ error: 'Failed to fetch dashboard data' }, 500);
  }
});

export { dashboard };

// Helper functions
function calculateKPIs(sessions, problems, streak) {
  const totalTime = sessions.reduce((sum, s) => sum + s.totalTime, 0);
  const totalProblems = problems.length;
  const correctProblems = problems.filter(p => p.correct).length;
  const accuracy = Math.round((correctProblems / totalProblems) * 100);

  // Calculate trends
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeek = problems.filter(p => new Date(p.timestamp) > oneWeekAgo);
  const lastWeek = problems.filter(p => 
    new Date(p.timestamp) > twoWeeksAgo && 
    new Date(p.timestamp) <= oneWeekAgo
  );

  const trends = {
    time: calculateTrend(thisWeek.reduce((sum, p) => sum + p.timeSpent, 0), 
                         lastWeek.reduce((sum, p) => sum + p.timeSpent, 0)),
    problems: calculateTrend(thisWeek.length, lastWeek.length),
    accuracy: calculateTrend(
      (thisWeek.filter(p => p.correct).length / thisWeek.length) * 100,
      (lastWeek.filter(p => p.correct).length / lastWeek.length) * 100
    )
  };

  return {
    totalTime,
    totalProblems,
    accuracy,
    streak: streak.current,
    trends
  };
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

// More helper functions...
```

---

## 📝 Step 6: Hook It Up to Practice Sessions

### File: `src/pages/RegularPracticePage.tsx`

```typescript
// When session ends
const handleSessionComplete = async () => {
  const sessionData = {
    userId: user.id,
    subject: 'math',
    topic: 'addition',
    mode: 'practice' as const,
    startTime: sessionStartTime,
    endTime: new Date(),
    problems: problemHistory // Array of Problem objects
  };

  try {
    const result = await completeSession(sessionData);
    
    // Show new achievements if any
    if (result.newAchievements.length > 0) {
      showAchievementModal(result.newAchievements);
    }

    // Navigate to dashboard or results
    navigate('/dashboard');
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};
```

---

## ✅ Implementation Checklist

- [ ] Copy shared types to `shared/types.ts`
- [ ] Create achievements in `src/lib/achievements.ts`
- [ ] Create API client in `src/lib/api.ts`
- [ ] Build Dashboard page
- [ ] Create worker endpoints
- [ ] Hook up session completion
- [ ] Test with real data
- [ ] Add loading states
- [ ] Handle errors gracefully

---

## 🎯 Next Steps

1. **Start with mock data** - Test UI first
2. **Build worker endpoints** - Connect to Durable Objects
3. **Wire up real data** - Replace mocks
4. **Test achievement system** - Verify unlocks work
5. **Polish & optimize** - Add animations, improve performance
