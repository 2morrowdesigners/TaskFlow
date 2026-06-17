import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  PhoneCall, 
  ListTodo,
  Clock3
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { Task, Followup } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarViewProps {
  tasks: Task[];
  followups: Followup[];
  onEditTask: (task: Task) => void;
  onEditFollowup: (f: Followup) => void;
}

export function CalendarView({ tasks, followups, onEditTask, onEditFollowup }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-zinc-950 uppercase tracking-tighter mb-2">Schedule</h2>
          <p className="text-zinc-500 font-medium tracking-tight">Your time-based view of all commitments.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="px-4 flex flex-col items-center min-w-[140px]">
            <span className="text-sm font-bold text-zinc-900">{format(currentMonth, 'MMMM')}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{format(currentMonth, 'yyyy')}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-xl">
            <ChevronRight className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-zinc-100 mx-1" />
          <Button variant="secondary" size="sm" onClick={goToToday} className="rounded-xl h-8 text-[10px] font-bold">
            Today
          </Button>
        </div>
      </header>

      <Card className="overflow-hidden border-none shadow-xl shadow-zinc-200/50">
        <div className="grid grid-cols-7 bg-zinc-950 text-white">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-widest opacity-60">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-white">
          {days.map((day, idx) => {
            const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
            const dayFollowups = followups.filter(f => f.followupDate && isSameDay(new Date(f.followupDate), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDay = isToday(day);

            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "min-h-[140px] p-2 border-r border-b border-zinc-50 flex flex-col gap-1 transition-colors hover:bg-zinc-50/50 relative",
                  !isCurrentMonth && "bg-zinc-50/30 opacity-40",
                  isTodayDay && "bg-zinc-50/80"
                )}
              >
                <div className="flex justify-end p-1">
                  <span className={cn(
                    "text-xs font-bold w-7 h-7 flex items-center justify-center rounded-xl",
                    isTodayDay ? "bg-zinc-950 text-white shadow-lg" : "text-zinc-400"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar max-h-[100px] px-1">
                  {dayTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={cn(
                        "w-full text-left p-1.5 rounded-lg text-[10px] font-bold truncate transition-all active:scale-95",
                        task.status === 'completed' 
                          ? "bg-zinc-100 text-zinc-400 line-through" 
                          : task.priority === 'high' ? "bg-red-50 text-red-600 border border-red-100" : "bg-zinc-100 text-zinc-900 border border-zinc-100"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <ListTodo className="w-2.5 h-2.5 shrink-0" />
                        {task.title}
                      </div>
                    </button>
                  ))}
                  {dayFollowups.map(f => (
                    <button
                      key={f.id}
                      onClick={() => onEditFollowup(f)}
                      className={cn(
                        "w-full text-left p-1.5 rounded-lg text-[10px] font-bold truncate transition-all active:scale-95 bg-blue-50 text-blue-700 border border-blue-100",
                        f.status === 'completed' && "opacity-60 grayscale"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <PhoneCall className="w-2.5 h-2.5 shrink-0" />
                        {f.contactName}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <section className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <Clock3 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900">Weekly Performance</h4>
          <p className="text-xs text-amber-700 leading-relaxed mb-4">You have {tasks.filter(t => isSameMonth(new Date(t.dueDate || 0), currentMonth)).length} tasks scheduled for this month. Stay focused and maintain your streak!</p>
          <div className="flex gap-2">
            <div className="h-2 w-24 bg-amber-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-600 w-[65%]" />
            </div>
            <span className="text-[10px] font-black uppercase text-amber-700">65% Target</span>
          </div>
        </div>
      </section>
    </div>
  );
}
