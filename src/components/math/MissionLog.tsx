import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
export interface LogEntry {
  id: string;
  problem: string;
  points: number;
  multiplier: number;
  timeTaken?: number;
  timestamp: number;
}
interface MissionLogProps {
  history: LogEntry[];
  className?: string;
}
export function MissionLog({ history, className }: MissionLogProps) {
  return (
    <div className={cn("flex flex-col h-full bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-indigo-400" />
          <span className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase">Tactical Performance Feed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[8px] font-black text-indigo-500/80 uppercase">Live Sync</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence initial={false} mode="popLayout">
          {history.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="h-full flex flex-col items-center justify-center opacity-20 py-8"
            >
              <Activity className="w-8 h-8 mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Data...</p>
            </motion.div>
          ) : (
            history.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20 }}
                className="relative group"
              >
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-indigo-500/40 rounded-full" />
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono font-black text-lg italic text-white/90">
                      {entry.problem}
                    </span>
                    <div className="flex items-center gap-1 bg-indigo-500/20 px-2 py-0.5 rounded-md">
                      <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-black text-indigo-300">x{entry.multiplier}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-tighter">
                    <div className="flex items-center gap-3 text-white/40">
                      <span>SEC: {entry.timeTaken ?? '--'}s</span>
                      <span className="text-white/20">•</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-2 h-2 fill-indigo-500 text-indigo-500" />
                        {entry.points} XP
                      </span>
                    </div>
                    <span className="text-indigo-400/60 font-mono">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      <div className="p-2 bg-black/40 border-t border-white/5">
        <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-widest overflow-hidden whitespace-nowrap">
          <span className="animate-pulse">TERMINAL_READY:</span>
          <span className="text-indigo-500/40">SYSTEM_HEALTH_OPTIMAL // BUFFER_CLEAR // {history.length} ITEMS_LOGGED</span>
        </div>
      </div>
    </div>
  );
}