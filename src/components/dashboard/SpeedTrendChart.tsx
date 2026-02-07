import { Card, Title, Text } from '@tremor/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { SpeedSession } from '@shared/types';

interface SpeedTrendChartProps {
    data: SpeedSession[];
}

export function SpeedTrendChart({ data }: SpeedTrendChartProps) {
    if (data.length === 0) {
        return (
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg h-full flex flex-col justify-center items-center">
                <Title className="text-gray-900 dark:text-white mb-2">Speed Trend</Title>
                <Text className="text-gray-500">No session data available yet.</Text>
            </Card>
        );
    }

    // Format data for chart
    const chartData = data.map(session => ({
        ...session,
        avgTime: parseFloat(session.avgTime.toFixed(1)),
        date: new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

    return (
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <Title className="text-gray-900 dark:text-white">Speed Improvement</Title>
            <Text className="text-gray-600 dark:text-gray-400 mb-4">
                Average time per problem (last 10 sessions)
            </Text>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'Seconds', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            color: '#1f2937'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="avgTime"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, fill: "#8b5cf6" }}
                        name="Avg Time (s)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}
