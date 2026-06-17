import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock3,
  Tag,
  ArrowLeft,
  History
} from 'lucide-react';
import { Task, Category } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface TaskHistoryProps {
  tasks: Task[];
  categories: Category[];
  onBack: () => void;
  onDeleteTask: (id: string) => void;
}

export function TaskHistory({ 
  tasks, 
  categories, 
  onBack,
  onDeleteTask
}: TaskHistoryProps) {
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                         (task.description?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesSearch;
  }).sort((a, b) => {
    const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h2 className="text-4xl font-black text-zinc-950 uppercase tracking-tighter mb-2 flex items-center gap-3">
              <History className="w-8 h-8" />
              Task History
            </h2>
            <p className="text-zinc-500 font-medium tracking-tight">Review your completed milestones and past achievements.</p>
          </div>
        </div>
      </header>

      <section className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Search completed tasks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 rounded-2xl bg-zinc-100 border-transparent focus:bg-white"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task) => {
          const category = categories.find(c => c.name === task.category);

          return (
            <Card key={task.id} className="group hover:border-zinc-300 transition-all overflow-hidden opacity-80 border-dashed">
              <div className="flex items-center gap-4 p-4 md:p-6">
                <div className="shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 fill-emerald-50" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-zinc-500 line-through truncate">
                      {task.title}
                    </h4>
                    <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                      Archived
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {task.completedAt && (
                      <span className="text-[10px] font-semibold flex items-center gap-1.5 text-zinc-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed on {format(new Date(task.completedAt), 'MMM d, yyyy')}
                      </span>
                    )}
                    {task.category && (
                      <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" style={{ color: category?.color }} />
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="w-8 h-8 rounded-xl text-zinc-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-400 bg-white border border-zinc-100 rounded-3xl border-dashed">
            <History className="w-16 h-16 mb-4 opacity-5" />
            <p className="font-bold tracking-tight">Archive is empty</p>
            <p className="text-sm">Completed tasks will appear here after 24 hours.</p>
          </div>
        )}
      </section>
    </div>
  );
}
