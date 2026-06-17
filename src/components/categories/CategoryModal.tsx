import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Tag, Palette } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
  editingCategory: Category | null;
}

const COLORS = [
  '#09090b', // Zinc
  '#dc2626', // Red
  '#ea580c', // Orange
  '#ca8a04', // Yellow
  '#16a34a', // Green
  '#0284c7', // Sky
  '#2563eb', // Blue
  '#7c3aed', // Violet
  '#db2777', // Pink
];

export function CategoryModal({ isOpen, onClose, onSave, editingCategory }: CategoryModalProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    color: COLORS[0],
  });

  useEffect(() => {
    if (editingCategory) {
      setFormData(editingCategory);
    } else {
      setFormData({
        name: '',
        color: COLORS[0],
      });
    }
  }, [editingCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? 'Edit Tag' : 'New Tag'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} className="rounded-2xl">Cancel</Button>
          <Button onClick={handleSubmit} className="rounded-2xl min-w-[140px] font-bold">
            {editingCategory ? 'Update Tag' : 'Create Tag'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
            <Tag className="w-3 h-3" />
            Category Identity
          </label>
          <Input 
            placeholder="Work, Development, Personal..." 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="h-14 font-bold rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
            <Palette className="w-3 h-3" />
            Visual Identity
          </label>
          <div className="grid grid-cols-5 gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={cn(
                  "w-12 h-12 rounded-2xl transition-all relative flex items-center justify-center",
                  formData.color === color ? "scale-110 shadow-lg ring-2 ring-zinc-900 ring-offset-2" : "hover:scale-105"
                )}
                style={{ backgroundColor: color }}
              >
                {formData.color === color && (
                  <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
