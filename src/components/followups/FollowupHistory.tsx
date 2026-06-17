import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock3,
  PhoneCall,
  ArrowLeft,
  History
} from 'lucide-react';
import { Followup } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { format } from 'date-fns';

interface FollowupHistoryProps {
  followups: Followup[];
  onBack: () => void;
  onDeleteFollowup: (id: string) => void;
}

export function FollowupHistory({ 
  followups, 
  onBack,
  onDeleteFollowup
}: FollowupHistoryProps) {
  const [search, setSearch] = useState('');

  const filteredFollowups = followups.filter(f => {
    return f.contactName.toLowerCase().includes(search.toLowerCase()) || 
           (f.notes?.toLowerCase().includes(search.toLowerCase()) || false);
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
              Follow-up History
            </h2>
            <p className="text-zinc-500 font-medium tracking-tight">Log of all successfully concluded communications.</p>
          </div>
        </div>
      </header>

      <section className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Search concluded calls..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 rounded-2xl bg-zinc-100 border-transparent focus:bg-white"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        {filteredFollowups.map((f) => {
          return (
            <Card key={f.id} className="group hover:border-zinc-300 transition-all overflow-hidden opacity-80 border-dashed">
              <div className="flex items-center gap-4 p-4 md:p-6">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-zinc-500 line-through truncate">
                      {f.contactName}
                    </h4>
                    <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                      Archived
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {f.completedAt && (
                      <span className="text-[10px] font-semibold flex items-center gap-1.5 text-zinc-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed on {format(new Date(f.completedAt), 'MMM d, yyyy')}
                      </span>
                    )}
                    {f.notes && (
                      <p className="text-[10px] text-zinc-400 truncate max-w-xs">{f.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onDeleteFollowup(f.id)} className="w-8 h-8 rounded-xl text-zinc-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredFollowups.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-400 bg-white border border-zinc-100 rounded-3xl border-dashed">
            <History className="w-16 h-16 mb-4 opacity-5" />
            <p className="font-bold tracking-tight">No history found</p>
            <p className="text-sm">Completed follow-ups will appear here after 24 hours.</p>
          </div>
        )}
      </section>
    </div>
  );
}
