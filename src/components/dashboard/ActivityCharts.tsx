import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface DailyActivity {
  day: string;
  problems: number;
  time: number;
}

interface SpeedTrend {
  session: string;
  avgTime: number;
  accuracy: number;
}

interface DailyActivityChartProps {
  data: DailyActivity[];
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m`;
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  const maxProblems = Math.max(...data.map(d => d.problems), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Daily Activity (Last 7 Days)
      </h3>
      <div className="space-y-4">
        {data.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
              {day.day}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {day.problems} problems
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(day.time)}
                </span>
              </div>
              <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(day.problems / maxProblems) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface SpeedImprovementChartProps {
  data: SpeedTrend[];
}

export function SpeedImprovementChart({ data }: SpeedImprovementChartProps) {
  const maxTime = Math.max(...data.map(d => d.avgTime), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Speed Improvement
      </h3>
      <div className="space-y-4">
        {data.map((session, index) => (
          <motion.div
            key={session.session}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-20 text-sm font-medium text-gray-600 dark:text-gray-400">
              {session.session}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {session.avgTime.toFixed(1)}s avg
                </span>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {session.accuracy}% accuracy
                </span>
              </div>
              <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((maxTime - session.avgTime + 5) / (maxTime + 5)) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Recharts-based alternative for more advanced charting
interface RechartsDailyActivityProps {
  data: DailyActivity[];
}

export function RechartsDailyActivity({ data }: RechartsDailyActivityProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Daily Activity (Last 7 Days)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => [`${value} problems`, 'Solved']}
          />
          <Bar 
            dataKey="problems" 
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
