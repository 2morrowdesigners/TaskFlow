import React, { useState, useEffect } from 'react';
import { Task, Priority, Category, TaskStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Calendar, Tag, Type, AlignLeft, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  editingTask: Task | null;
  categories: Category[];
}

export function TaskModal({ isOpen, onClose, onSave, editingTask, categories }: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date().toISOString().slice(0, 16),
    category: '',
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        ...editingTask,
        dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().slice(0, 16) : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date().toISOString().slice(0, 16),
        category: categories[0]?.name || '',
      });
    }
  }, [editingTask, categories, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTask ? 'Edit Task' : 'Compose Task'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} className="rounded-2xl">Discard</Button>
          <Button onClick={handleSubmit} className="rounded-2xl min-w-[140px] font-bold">
            {editingTask ? 'Apply Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
            <Type className="w-3 h-3" />
            Objective Title
          </label>
          <Input 
            placeholder="What needs to be done?" 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="h-14 text-lg font-bold rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
            <AlignLeft className="w-3 h-3" />
            Briefing
          </label>
          <textarea 
            placeholder="Context or additional details..." 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full min-h-[120px] p-4 rounded-2xl bg-zinc-50 border-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:bg-white transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Deadline
            </label>
            <Input 
              type="datetime-local" 
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
              <Tag className="w-3 h-3" />
              Workspace Tag
            </label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-11 px-4 rounded-2xl bg-zinc-50 border-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:bg-white transition-all"
            >
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            Execution Priority
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFormData({ ...formData, priority: p })}
                className={cn(
                  "py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0",
                  formData.priority === p 
                    ? p === 'high' ? "bg-red-50 border-red-200 text-red-600 shadow-sm" : 
                      p === 'medium' ? "bg-amber-50 border-amber-200 text-amber-600 shadow-sm" :
                      "bg-zinc-900 border-zinc-900 text-white shadow-lg"
                    : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
