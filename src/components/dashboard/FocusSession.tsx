import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, Zap, X, Target, Bell } from 'lucide-react';
import { Task } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface FocusSessionProps {
  task: Task | null;
  onClose: () => void;
  onComplete: () => void;
}

export function FocusSession({ task, onClose, onComplete }: FocusSessionProps) {
  const [timer, setTimer] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timer, onComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (timer / (25 * 60)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-xl"
    >
      <div className="max-w-md w-full relative overflow-hidden flex flex-col items-center text-center">
        <Button 
          variant="glass" 
          size="icon" 
          onClick={onClose} 
          className="absolute top-0 right-0 rounded-2xl"
        >
          <X className="w-5 h-5" />
        </Button>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full space-y-12"
        >
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              Focusing on session
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter leading-tight">
              {task?.title || "Deep Focus Session"}
            </h2>
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm font-medium">
              <Target className="w-4 h-4" />
              Main Objective
            </div>
          </header>

          <div className="relative flex items-center justify-center">
            {/* Simple progress ring */}
            <svg className="w-64 h-64 -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={754}
                animate={{ strokeDashoffset: 754 * (progress / 100) }}
                className="text-white"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-white tabular-nums tracking-tighter">
                {formatTime(timer)}
              </span>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mt-2">Minutes remaining</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => setIsRunning(!isRunning)}
              className="w-20 h-20 rounded-3xl group"
            >
              {isRunning ? (
                <Pause className="w-8 h-8 group-hover:scale-110 transition-transform" />
              ) : (
                <Play className="w-8 h-8 group-hover:scale-110 transition-transform fill-current ml-1" />
              )}
            </Button>
            <Button 
              size="lg" 
              variant="glass" 
              onClick={() => setTimer(25 * 60)}
              className="w-16 h-16 rounded-3xl"
            >
              <Square className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                <Bell className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Alerts On</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
