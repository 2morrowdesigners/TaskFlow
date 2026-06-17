import React from 'react';
import { Tag, Plus, Trash2, Edit3, Circle } from 'lucide-react';
import { Category } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface CategoryListProps {
  categories: Category[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoryList({ categories, onAddCategory, onEditCategory, onDeleteCategory }: CategoryListProps) {
  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-zinc-950 uppercase tracking-tighter mb-2">Categories</h2>
          <p className="text-zinc-500 font-medium tracking-tight">Organize your workspace with custom tags.</p>
        </div>
        <Button onClick={onAddCategory} className="rounded-2xl pr-3">
          <Plus className="w-5 h-5 mr-1" />
          Add Category
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="group p-6 hover:border-zinc-300 transition-all">
            <div className="flex flex-col gap-6">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: category.color }}
              >
                <Tag className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg text-zinc-900">{category.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Custom Category</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => onEditCategory(category)} className="w-8 h-8 rounded-xl text-zinc-400 hover:text-zinc-900">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteCategory(category.id)} className="w-8 h-8 rounded-xl text-zinc-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {categories.length === 0 && (
          <div className="lg:col-span-4 py-24 flex flex-col items-center justify-center text-zinc-400 bg-white border border-zinc-100 rounded-3xl">
            <Tag className="w-16 h-16 mb-4 opacity-5" />
            <p className="font-bold tracking-tight">No categories defined</p>
            <p className="text-sm">Start organizing by creating your first category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
