import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  ListTodo, 
  PhoneCall, 
  Zap, 
  Target, 
  Clock3, 
  ChevronRight,
  TrendingUp,
  Activity,
  CalendarDays
} from 'lucide-react';
import { Task, Followup, Category } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { format, isToday, isBefore, isAfter, startOfDay, endOfDay, addDays } from 'date-fns';
import { cn } from '../../lib/utils';

interface DashboardProps {
  tasks: Task[];
  followups: Followup[];
  categories: Category[];
  onAddTask: () => void;
  onAddFollowup: () => void;
  onFocusTask: (task: Task) => void;
  onViewAllTasks: () => void;
}

export function Dashboard({ tasks, followups, categories, onAddTask, onAddFollowup, onFocusTask, onViewAllTasks }: DashboardProps) {
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');
  const overdueTasks = pendingTasks.filter(t => t.dueDate && isBefore(new Date(t.dueDate), startOfDay(new Date())));
  const dueSoonTasks = pendingTasks.filter(t => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    const twoDaysFromNow = addDays(new Date(), 2);
    return isAfter(dueDate, startOfDay(new Date())) && isBefore(dueDate, twoDaysFromNow);
  });

  // Combine and de-duplicate
  const focusTasks = Array.from(new Set([
    ...overdueTasks,
    ...highPriorityTasks,
    ...dueSoonTasks
  ])).slice(0, 6); // Top 6 most important

  const getTaskBadge = (task: Task) => {
    if (task.dueDate && isBefore(new Date(task.dueDate), startOfDay(new Date()))) {
      return { label: 'Overdue', variant: 'danger' as const };
    }
    if (task.dueDate && isToday(new Date(task.dueDate))) {
      return { label: 'Due Today', variant: 'warning' as const };
    }
    if (task.priority === 'high') {
      return { label: 'High Priority', variant: 'warning' as const };
    }
    return null;
  };

  const todayFollowups = followups.filter(f => f.status !== 'completed' && isToday(new Date(f.followupDate)));

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="px-3 py-1 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              {format(new Date(), 'MMMM yyyy')}
            </span>
            <div className="w-1 h-1 rounded-full bg-zinc-300" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Live Workspace
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-zinc-950 uppercase tracking-tighter mb-4 leading-[0.9]">
            It's {format(new Date(), 'EEEE')}.
          </h2>
          <p className="text-lg text-zinc-500 font-medium tracking-tight">
            You have <span className="text-zinc-950 font-bold">{pendingTasks.length} pending tasks</span> and <span className="text-zinc-950 font-bold">{todayFollowups.length} scheduled calls</span> to handle today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={onAddFollowup} variant="secondary" className="rounded-2xl h-14 px-6 border-zinc-200">
            <PhoneCall className="w-4 h-4 mr-2" />
            <span className="font-bold">Add Call</span>
          </Button>
          <Button onClick={onAddTask} className="rounded-2xl h-14 px-8 shadow-xl shadow-zinc-900/20">
            <Plus className="w-5 h-5 mr-1" />
            <span className="font-bold">New Task</span>
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-zinc-900" />
              Main Focus
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onViewAllTasks}
              className="text-zinc-500 hover:text-zinc-900"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {focusTasks.map((task, i) => {
              const badge = getTaskBadge(task);
              const category = categories.find(c => c.name === task.category);
              
              return (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-1 pl-6 flex items-center justify-between group hover:border-zinc-300">
                    <div className="flex items-center gap-4 py-4">
                      <div className={cn(
                        "w-2 h-10 rounded-full",
                        badge?.label === 'Overdue' ? "bg-red-500" : 
                        badge?.label === 'Due Today' ? "bg-amber-500" : 
                        "bg-zinc-200"
                      )} />
                      <div>
                        <h4 className="font-bold text-zinc-900 line-clamp-1">{task.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          {badge && (
                            <Badge variant={badge.variant} className="text-[10px] h-5 rounded-md px-1.5 uppercase font-black tracking-tighter">
                              {badge.label}
                            </Badge>
                          )}
                          {task.dueDate && (
                            <span className={cn(
                              "text-[10px] flex items-center gap-1 font-medium",
                              isBefore(new Date(task.dueDate), startOfDay(new Date())) ? "text-red-500" : "text-zinc-400"
                            )}>
                              <Clock3 className="w-3 h-3" />
                              {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pr-4 flex items-center gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => onFocusTask(task)}
                        className="rounded-xl font-bold text-[10px] h-8"
                      >
                        Focus
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
            {focusTasks.length === 0 && (
              <div className="p-12 border-2 border-dashed border-zinc-100 rounded-3xl flex flex-col items-center justify-center text-zinc-400">
                <Target className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-sm font-medium">No urgent tasks. Peace of mind!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-zinc-900" />
              Schedule
            </h3>
          </div>
          
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Calls Today</h4>
              {todayFollowups.length > 0 ? (
                todayFollowups.map(f => (
                  <div key={f.id} className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-zinc-900">{f.contactName}</p>
                      <p className="text-[10px] text-zinc-400">{format(new Date(f.followupDate), 'h:mm a')}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="w-8 h-8 rounded-xl">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 font-medium italic">No calls scheduled for today.</p>
              )}
            </div>

            <div className="p-4 bg-zinc-900 rounded-3xl text-white relative overflow-hidden">
              <TrendingUp className="absolute top-0 right-0 w-24 h-24 text-white/5 -translate-y-4 translate-x-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Productivity</p>
              <h5 className="text-xl font-bold mb-1">Weekly Streak</h5>
              <div className="flex gap-1 mt-4">
                {[1,2,3,4,5,6,7].map(d => (
                  <div key={d} className={`h-1.5 flex-1 rounded-full ${d <= 4 ? 'bg-white' : 'bg-white/20'}`} />
                ))}
              </div>
              <p className="text-[10px] font-medium text-zinc-400 mt-2">4/7 days active this week</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
