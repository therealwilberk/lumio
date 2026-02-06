import { Clock, CheckCircle, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  colorScheme: 'blue' | 'purple' | 'green' | 'orange';
}

const statColors = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    iconBg: 'bg-green-100 dark:bg-green-900/50',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
};

function StatCard({ icon: Icon, label, value, trend, colorScheme }: StatCardProps) {
  const colors = statColors[colorScheme];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`${colors.bg} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex flex-col gap-4">
        <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${colors.iconColor}`} />
        </div>
        <div>
          <div className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            {value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
            {label}
          </div>
          {trend && (
            <div className={`text-xs mt-2 font-semibold ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.value}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface StatsGridProps {
  totalTime: string;
  problemsSolved: number;
  accuracyRate: number;
  streak: number;
  timeTrend?: { value: string; positive: boolean };
  problemsTrend?: { value: string; positive: boolean };
  accuracyTrend?: { value: string; positive: boolean };
}

export function StatsGrid({
  totalTime,
  problemsSolved,
  accuracyRate,
  streak,
  timeTrend = { value: '+12% this week', positive: true },
  problemsTrend = { value: '+8% this week', positive: true },
  accuracyTrend = { value: '+3% this week', positive: true },
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Clock}
        label="Total Practice Time"
        value={totalTime}
        trend={timeTrend}
        colorScheme="blue"
      />
      <StatCard
        icon={CheckCircle}
        label="Problems Solved"
        value={problemsSolved.toLocaleString()}
        trend={problemsTrend}
        colorScheme="purple"
      />
      <StatCard
        icon={Target}
        label="Accuracy Rate"
        value={`${accuracyRate}%`}
        trend={accuracyTrend}
        colorScheme="green"
      />
      <StatCard
        icon={Flame}
        label="Current Streak"
        value={`${streak}d`}
        trend={{ value: 'Active 🔥', positive: true }}
        colorScheme="orange"
      />
    </div>
  );
}
