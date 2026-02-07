
import { Card, Title, Text, Flex, ProgressBar } from '@tremor/react';
import type { TopicMastery } from '@shared/types';
import { motion } from 'framer-motion';

interface TopicMasteryCirclesProps {
    data: TopicMastery[];
}

export function TopicMasteryCircles({ data }: TopicMasteryCirclesProps) {
    if (data.length === 0) {
        return (
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg h-full flex flex-col justify-center items-center">
                <Title className="text-gray-900 dark:text-white mb-2">Topic Mastery</Title>
                <Text className="text-gray-500">Start practicing to track topic progress!</Text>
            </Card>
        );
    }

    return (
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <Title className="text-gray-900 dark:text-white">Topic Mastery</Title>
            <Text className="text-gray-600 dark:text-gray-400 mb-6">
                Your progress across different math topics
            </Text>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.map((topic, index) => (
                    <motion.div
                        key={topic.topic}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                    >
                        <Flex className="mb-2">
                            <Text className="font-bold text-gray-900 dark:text-white capitalize">
                                {topic.topic}
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400">
                                Lvl {topic.currentLevel}/{topic.totalLevels}
                            </Text>
                        </Flex>

                        <Flex className="mb-2 space-x-2">
                            <div className="w-full">
                                <ProgressBar value={topic.completionPercent} color="blue" className="mt-2" />
                            </div>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 min-w-[3ch] text-right">
                                {Math.round(topic.completionPercent)}%
                            </span>
                        </Flex>

                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>{topic.problemsSolved} problems solved</span>
                            <span className={topic.accuracy >= 90 ? 'text-green-500 font-bold' : ''}>
                                {topic.accuracy}% accuracy
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Card>
    );
}
