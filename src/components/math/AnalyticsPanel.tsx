import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Timer, BarChart, Download, Database, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { calculatePerformanceSummary } from '@/lib/math-utils';
import { cn } from '@/lib/utils';
import type { SolveLog } from '@shared/types';
interface AnalyticsPanelProps {
  logs: SolveLog[];
  onExport: () => void;
  className?: string;
}
export function AnalyticsPanel({ logs, onExport, className }: AnalyticsPanelProps) {
  const summary = useMemo(() => calculatePerformanceSummary(logs), [logs]);
  return (
    <Card className={cn("bg-black/80 border-indigo-500/30 backdrop-blur-xl rounded-3xl overflow-hidden relative", className)}>
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      <CardHeader className="border-b border-white/5 bg-white/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black italic tracking-widest flex items-center gap-2 text-indigo-400">
            <Database className="w-4 h-4" /> TACTICAL DATA CORE
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onExport} className="h-8 text-[10px] font-black uppercase tracking-widest text-green-400 hover:text-green-300 hover:bg-green-500/10">
            <Download className="w-3 h-3 mr-2" /> CORE DUMP
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {logs.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-white/20">
            <ShieldAlert className="w-12 h-12 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">No Tactical Data Logged</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {summary.map((stat) => (
                <div key={stat.name} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.name}</span>
                    <BarChart className="w-3 h-3 text-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black">
                      <span className="text-white/60">ACCURACY</span>
                      <span className="text-indigo-400 data-glow">{Math.round(stat.accuracy)}%</span>
                    </div>
                    <Progress value={stat.accuracy} className="h-1.5 bg-white/10" />
                  </div>
                  <div className="flex justify-between text-[10px] font-black">
                    <span className="text-white/60">AVG TIME</span>
                    <span className="flex items-center gap-1 text-orange-400">
                      <Timer className="w-3 h-3" /> {stat.avgTime.toFixed(1)}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Recent Signal Buffer</span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                {logs.slice(0, 10).map((log, i) => (
                  <div key={log.id} className="terminal-line flex items-center justify-between py-1 px-3 bg-white/5 rounded text-[10px] font-mono">
                    <span className={cn(log.isCorrect ? "text-green-500" : "text-red-500")}>
                      [{log.isCorrect ? "OK" : "ERR"}] {log.num1}+{log.num2}={log.userAnswer}
                    </span>
                    <span className="text-white/20">{log.timeTaken}s</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}