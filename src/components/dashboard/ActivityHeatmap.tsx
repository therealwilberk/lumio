import { Card, Title, Text } from '@tremor/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { DayActivity } from '@shared/types';

interface ActivityHeatmapProps {
    data: DayActivity[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
    // Get last 7 days for simplified view
    const last7Days = data.slice(-7);

    // Transform data for bar chart
    const chartData = last7Days.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        problems: day.problemCount,
        time: Math.round(day.practiceTime / 60) // Convert to minutes
    }));

    return (
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <Title className="text-gray-900 dark:text-white">Daily Activity (Last 7 Days)</Title>
            <Text className="text-gray-600 dark:text-gray-400 mb-4">
                Problems solved and practice time per day
            </Text>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis
                        dataKey="date"
                        className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                        yAxisId="left"
                        className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        className="text-gray-600 dark:text-gray-400"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend />
                    <Bar
                        yAxisId="left"
                        dataKey="problems"
                        fill="#3b82f6"
                        name="Problems Solved"
                        radius={[8, 8, 0, 0]}
                    />
                    <Bar
                        yAxisId="right"
                        dataKey="time"
                        fill="#10b981"
                        name="Time (minutes)"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}
