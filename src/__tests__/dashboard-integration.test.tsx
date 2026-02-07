import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import { DashboardPage } from '@/pages/DashboardPage';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import type { DashboardResponse } from '@shared/types';

// Mock dependencies
vi.mock('@/hooks/useAuth');
vi.mock('@/lib/api-client');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock Data
const mockKpis = {
    totalTime: '5h 30m',
    totalProblems: 150,
    accuracy: 85,
    streak: 7
};

const mockDashboardData: DashboardResponse = {
    kpis: mockKpis,
    charts: {
        activityHeatmap: [
            { date: '2023-01-01', problemCount: 10, practiceTime: 300, subjects: ['Math'] }
        ],
        performanceRadar: {
            speed: 80,
            accuracy: 85,
            consistency: 90,
            problemSolving: 75,
            mentalMath: 70
        },
        speedTrend: [
            { sessionNumber: 1, date: new Date(), avgTime: 5, accuracy: 90, problemCount: 10 }
        ],
        topicMastery: [
            { topic: 'Addition', subject: 'Math', completionPercent: 50, currentLevel: 5, totalLevels: 10, accuracy: 95, avgTime: 3, problemsSolved: 100 }
        ]
    },
    achievements: {
        unlocked: [
            { id: 'first_steps', name: 'First Steps', description: 'Solve 10 problems', emoji: '👣', category: 'milestone', criteria: {}, points: 10 }
        ],
        locked: [],
        recentUnlocks: []
    },
    troubleSpots: []
};

describe('DashboardPage Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        // Setup generic mock return to avoid immediate resolve if needed, 
        // or just checking if 'Loading' is present before wait
        (useAuth as any).mockReturnValue({
            user: { id: 'test-user', username: 'Tester' },
            isAuthenticated: true
        });
        (api as any).mockReturnValue(new Promise(() => { })); // Never resolves for this test

        render(<DashboardPage />);
        expect(screen.getByText(/Loading Dashboard/i)).toBeInTheDocument();
    });

    it('fetches and displays dashboard data', async () => {
        (useAuth as any).mockReturnValue({
            user: { id: 'test-user', username: 'Tester' },
            isAuthenticated: true
        });
        (api as any).mockResolvedValue(mockDashboardData);

        render(<DashboardPage />);

        // Wait for loading to finish and data to appear
        await waitFor(() => {
            expect(screen.queryByText(/Loading Dashboard/i)).not.toBeInTheDocument();
        });

        // Check Header
        // Check Header
        expect(screen.getByRole('heading', { name: /My Stats/i })).toBeInTheDocument();
        expect(screen.getByText(/7 day streak/i)).toBeInTheDocument();

        // Check KPI Cards
        expect(screen.getByText('5h 30m')).toBeInTheDocument(); // Practice Time
        expect(screen.getByText('150')).toBeInTheDocument();    // Problems Solved

        // Check Charts presence (by text in legends or titles if available, or just container existence)
        // Since Tremor/Recharts might be hard to query by text, we check for section containers
        // But we know 'Activity Heatmap' or similar likely isn't printed as text in the component unless we added titles.
        // DashboardPage has titles for sections? 
        // Looking at DashboardPage code: "My Stats!", "Results", "Trouble Spots", "Achievements"

        const troubleSpots = screen.getAllByText(/Trouble Spots/i);
        expect(troubleSpots.length).toBeGreaterThan(0);

        const achievements = screen.getAllByText(/Achievements/i);
        expect(achievements.length).toBeGreaterThan(0);

        // Check Achievement
        expect(screen.getByText('First Steps')).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
        (useAuth as any).mockReturnValue({
            user: { id: 'test-user', username: 'Tester' },
            isAuthenticated: true
        });
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        (api as any).mockRejectedValue(new Error('API Error'));

        render(<DashboardPage />);

        await waitFor(() => {
            expect(screen.queryByText(/Loading Dashboard/i)).not.toBeInTheDocument();
        });

        // Should still render partial dashboard or empty state? 
        // in the code: .catch(console.error).finally(() => setLoading(false));
        // If error, dashboardData is null.
        // kpis defaults to 0s. 

        expect(screen.getByRole('heading', { name: /My Stats/i })).toBeInTheDocument();
        expect(screen.getByText('0m')).toBeInTheDocument(); // Default total time

        consoleSpy.mockRestore();
    });
});
