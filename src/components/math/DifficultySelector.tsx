import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Shield, Zap, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DifficultyLevel } from '@shared/types';
interface DifficultySelectorProps {
  value: DifficultyLevel;
  onValueChange: (val: DifficultyLevel) => void;
  disabled?: boolean;
}
export function DifficultySelector({ value, onValueChange, disabled }: DifficultySelectorProps) {
  const options = [
    { value: 'easy', label: 'EASY', icon: Shield, color: 'text-green-400', glow: 'hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]', active: 'data-[state=on]:bg-green-500/20 data-[state=on]:border-green-500' },
    { value: 'medium', label: 'MEDIUM', icon: Zap, color: 'text-orange-400', glow: 'hover:shadow-[0_0_15px_rgba(251,146,60,0.4)]', active: 'data-[state=on]:bg-orange-500/20 data-[state=on]:border-orange-500' },
    { value: 'hard', label: 'HARD', icon: Skull, color: 'text-red-500', glow: 'hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]', active: 'data-[state=on]:bg-red-500/20 data-[state=on]:border-red-500' },
  ];
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => val && onValueChange(val as DifficultyLevel)}
      disabled={disabled}
      className="flex gap-4"
    >
      {options.map((opt) => (
        <ToggleGroupItem
          key={opt.value}
          value={opt.value}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-2 p-4 h-auto rounded-2xl border-2 border-white/5 bg-black/40 backdrop-blur-md transition-all duration-300",
            opt.glow,
            opt.active
          )}
        >
          <opt.icon className={cn("w-6 h-6", opt.color)} />
          <span className={cn("text-[10px] font-black tracking-[0.2em]", opt.color)}>
            {opt.label}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}