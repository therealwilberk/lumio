import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Shield, Zap, Skull, Target, TrendingUp, Cpu } from "lucide-react";
export function MissionBriefing({ trigger }: { trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2 border-indigo-500/50 hover:bg-indigo-500/10">
            <BookOpen className="w-4 h-4" /> MISSION INTEL
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-black/95 border-indigo-500/30 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <Cpu className="w-8 h-8 text-indigo-500" /> TACTICAL MISSION BRIEFING
          </DialogTitle>
          <DialogDescription className="text-indigo-400 font-bold uppercase tracking-widest text-xs">
            NumberNexus OS v2.0 // Grade 6 Math Deployment
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 overflow-y-auto max-h-[70vh] pr-2">
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-black text-white/40 uppercase tracking-[0.2em]">
              <Target className="w-4 h-4" /> Objective
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Master rapid mental addition using advanced mental models. Your mission is to solve complex problems by breaking them down into manageable "Ten-Blocks" and "Single Units."
            </p>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 space-y-2">
              <Shield className="w-5 h-5 text-green-400" />
              <div className="font-black text-[10px] text-green-400 tracking-widest uppercase">Easy Mode</div>
              <p className="text-xs text-white/60">Sums up to 10. Focus on one-to-one counting and frame filling.</p>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 space-y-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <div className="font-black text-[10px] text-orange-400 tracking-widest uppercase">Medium Mode</div>
              <p className="text-xs text-white/60">Sums up to 20. Master the "Bridge to Ten" strategy.</p>
            </div>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
              <Skull className="w-5 h-5 text-red-500" />
              <div className="font-black text-[10px] text-red-500 tracking-widest uppercase">Hard Mode</div>
              <p className="text-xs text-white/60">Sums up to 60. Use "Decomposition" to separate Tens and Ones.</p>
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black text-white/40 uppercase tracking-[0.2em]">
              <TrendingUp className="w-4 h-4" /> Advanced Multipliers
            </h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span className="font-bold text-white">Turbo Bonus:</span> Finish in under 5s for a 4x XP multiplier.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span className="font-bold text-white">Hardcore Streak:</span> Streak &gt; 10 in Hard Mode expands problem limit to 60.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span className="font-bold text-white">Strategy Intel:</span> Problems &gt; 20 activate the Advanced Decomposition View.
              </li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}