import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle,
  Clock3,
  Tag,
  AlertCircle,
  ListTodo,
  History
} from 'lucide-react';
import { Task, Priority, Category, TaskStatus } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { format, isBefore, isToday } from 'date-fns';
import { cn } from '../../lib/utils';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleStatus: (task: Task) => void;
  onFocusTask: (task: Task) => void;
  onViewHistory: () => void;
}

export function TaskList({ 
  tasks, 
  categories, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onToggleStatus,
  onFocusTask,
  onViewHistory
}: TaskListProps) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                         (task.description?.toLowerCase().includes(search.toLowerCase()) || false);
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    return matchesSearch && matchesPriority && matchesCategory;
  }).sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-zinc-950 uppercase tracking-tighter mb-2">My Tasks</h2>
          <p className="text-zinc-500 font-medium tracking-tight">Manage your productivity and daily objectives.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onViewHistory} className="rounded-2xl pr-3">
            <History className="w-5 h-5 mr-1" />
            History
          </Button>
          <Button onClick={onAddTask} className="rounded-2xl pr-3">
            <Plus className="w-5 h-5 mr-1" />
            Create Task
          </Button>
        </div>
      </header>

      <section className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Search tasks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 rounded-2xl bg-zinc-100 border-transparent focus:bg-white"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="h-11 px-4 rounded-2xl bg-zinc-100 border-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
          >
            <option value="all">Priority: All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 px-4 rounded-2xl bg-zinc-100 border-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
          >
            <option value="all">Category: All</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task) => {
          const isOverdue = task.status !== 'completed' && task.dueDate && isBefore(new Date(task.dueDate), new Date()) && !isToday(new Date(task.dueDate));
          const category = categories.find(c => c.name === task.category);

          return (
            <Card key={task.id} className={cn(
              "group hover:border-zinc-300 transition-all overflow-hidden",
              task.status === 'completed' && "opacity-60 bg-zinc-50"
            )}>
              <div className="flex items-center gap-4 p-4 md:p-6">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleStatus(task);
                  }}
                  className="shrink-0 transition-transform active:scale-90"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <Circle className="w-7 h-7 text-zinc-300 group-hover:text-zinc-400" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn(
                      "font-bold text-zinc-900 transition-all",
                      task.status === 'completed' && "line-through text-zinc-500"
                    )}>
                      {task.title}
                    </h4>
                    <Badge variant={getPriorityColor(task.priority)} className="text-[10px] h-4 rounded-md uppercase tracking-tight font-black px-1.5 border-none">
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {task.dueDate && (
                      <span className={cn(
                        "text-[10px] font-semibold flex items-center gap-1.5",
                        isOverdue ? "text-red-500" : "text-zinc-400"
                      )}>
                        <Clock3 className="w-3.5 h-3.5" />
                        {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
                        {format(new Date(task.dueDate), 'MMM d, h:mm a')}
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
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => onFocusTask(task)}
                    className="rounded-xl font-bold h-8 text-[10px]"
                    disabled={task.status === 'completed'}
                  >
                    Focus
                  </Button>
                  <div className="flex items-center gap-1 h-8 opacity-0 group-hover:opacity-100 transition-all">
                    <Button variant="ghost" size="icon" onClick={() => onEditTask(task)} className="w-8 h-8 rounded-xl text-zinc-400 hover:text-zinc-900">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="w-8 h-8 rounded-xl text-zinc-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-400 bg-white border border-zinc-100 rounded-3xl">
            <ListTodo className="w-16 h-16 mb-4 opacity-5" />
            <p className="font-bold tracking-tight">No tasks found</p>
            <p className="text-sm">Try adjusting your filters or create a new task.</p>
          </div>
        )}
      </section>
    </div>
  );
}
