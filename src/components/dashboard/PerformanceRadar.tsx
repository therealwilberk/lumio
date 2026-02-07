import { Card, Title, Text } from '@tremor/react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import type { PerformanceMetrics } from '@shared/types';

interface PerformanceRadarProps {
    metrics: PerformanceMetrics;
}

export function PerformanceRadar({ metrics }: PerformanceRadarProps) {
    const data = [
        { metric: 'Speed', value: metrics.speed, fullMark: 100 },
        { metric: 'Accuracy', value: metrics.accuracy, fullMark: 100 },
        { metric: 'Consistency', value: metrics.consistency, fullMark: 100 },
        { metric: 'Problem Solving', value: metrics.problemSolving, fullMark: 100 },
        { metric: 'Mental Math', value: metrics.mentalMath, fullMark: 100 }
    ];

    return (
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <Title className="text-gray-900 dark:text-white">Performance Metrics</Title>
            <Text className="text-gray-600 dark:text-gray-400 mb-4">
                Your strengths across different areas
            </Text>
            <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={data}>
                    <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
                    <PolarAngleAxis
                        dataKey="metric"
                        className="text-gray-600 dark:text-gray-400"
                        tick={{ fill: 'currentColor', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        className="text-gray-600 dark:text-gray-400"
                    />
                    <Radar
                        name="Performance"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                        strokeWidth={2}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </Card>
    );
}
