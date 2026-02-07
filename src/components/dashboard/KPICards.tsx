import { Card, Metric, Text, Flex, BadgeDelta } from '@tremor/react';
import { Clock, Target, TrendingUp, Flame } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendType?: 'increase' | 'decrease' | 'unchanged';
    subtitle?: string;
}

export function KPICard({ title, value, icon, trend, trendType, subtitle }: KPICardProps) {
    return (
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <Flex alignItems="start" justifyContent="between">
                <div>
                    <Text className="text-gray-600 dark:text-gray-400">{title}</Text>
                    <Metric className="mt-2 text-gray-900 dark:text-white">{value}</Metric>
                    {subtitle && (
                        <Text className="mt-1 text-sm text-gray-500 dark:text-gray-500">{subtitle}</Text>
                    )}
                </div>
                <div className="text-blue-500 dark:text-blue-400">{icon}</div>
            </Flex>
            {trend && (
                <Flex className="mt-4">
                    <BadgeDelta deltaType={trendType || 'unchanged'} size="xs">
                        {trend}
                    </BadgeDelta>
                </Flex>
            )}
        </Card>
    );
}

interface KPIGridProps {
    totalTime: string;
    problemsSolved: number;
    accuracy: number;
    streak: number;
    timeTrend?: string;
    problemsTrend?: string;
    accuracyTrend?: string;
    streakStatus?: string;
}

export function KPIGrid({
    totalTime,
    problemsSolved,
    accuracy,
    streak,
    timeTrend = '+12% this week',
    problemsTrend = '+8% this week',
    accuracyTrend = '+2% this week',
    streakStatus = 'Active 🔥'
}: KPIGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
                title="Practice Time"
                value={totalTime}
                icon={<Clock className="h-8 w-8" />}
                trend={timeTrend}
                trendType="increase"
                subtitle="Total time practicing"
            />
            <KPICard
                title="Problems Solved"
                value={problemsSolved}
                icon={<Target className="h-8 w-8" />}
                trend={problemsTrend}
                trendType="increase"
                subtitle="All time"
            />
            <KPICard
                title="Accuracy"
                value={`${accuracy}%`}
                icon={<TrendingUp className="h-8 w-8" />}
                trend={accuracyTrend}
                trendType="increase"
                subtitle="Overall success rate"
            />
            <KPICard
                title="Current Streak"
                value={`${streak} days`}
                icon={<Flame className="h-8 w-8" />}
                trend={streakStatus}
                trendType={streak > 0 ? 'increase' : 'unchanged'}
                subtitle={streak > 0 ? 'Keep it going!' : 'Start today!'}
            />
        </div>
    );
}
