import React, { useState } from 'react';
import { 
  PhoneCall, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock3, 
  User,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Circle,
  History
} from 'lucide-react';
import { Followup } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { format, isToday, isBefore } from 'date-fns';
import { cn } from '../../lib/utils';

interface FollowupListProps {
  followups: Followup[];
  onAddFollowup: () => void;
  onEditFollowup: (followup: Followup) => void;
  onDeleteFollowup: (id: string) => void;
  onToggleStatus: (followup: Followup) => void;
  onViewHistory: () => void;
}

export function FollowupList({ 
  followups, 
  onAddFollowup, 
  onEditFollowup, 
  onDeleteFollowup,
  onToggleStatus,
  onViewHistory
}: FollowupListProps) {
  const [search, setSearch] = useState('');

  const filteredFollowups = followups.filter(f => 
    f.contactName.toLowerCase().includes(search.toLowerCase()) || 
    (f.notes?.toLowerCase().includes(search.toLowerCase()) || false)
  ).sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return new Date(a.followupDate).getTime() - new Date(b.followupDate).getTime();
  });

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-zinc-950 uppercase tracking-tighter mb-2">Follow-ups</h2>
          <p className="text-zinc-500 font-medium tracking-tight">Never miss a call or relationship opportunity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onViewHistory} className="rounded-2xl pr-3">
            <History className="w-5 h-5 mr-1" />
            History
          </Button>
          <Button onClick={onAddFollowup} className="rounded-2xl pr-3">
            <Plus className="w-5 h-5 mr-1" />
            Add Follow-up
          </Button>
        </div>
      </header>

      <section className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Search contacts or notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 rounded-2xl bg-zinc-100 border-transparent focus:bg-white"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFollowups.map((f) => {
          const callDate = new Date(f.followupDate);
          const isOverdue = f.status !== 'completed' && isBefore(callDate, new Date()) && !isToday(callDate);
          const isUpcomingToday = f.status !== 'completed' && isToday(callDate);

          return (
            <Card key={f.id} className={cn(
              "group flex flex-col hover:border-zinc-300 transition-all overflow-hidden",
              f.status === 'completed' && "opacity-60 bg-zinc-50"
            )}>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                      f.status === 'completed' ? "bg-zinc-100 text-zinc-400" : "bg-blue-50 text-blue-600"
                    )}>
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-bold text-zinc-900 line-clamp-1",
                        f.status === 'completed' && "line-through text-zinc-500"
                      )}>
                        {f.contactName}
                      </h4>
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                        isOverdue ? "text-red-500" : isUpcomingToday ? "text-blue-500" : "text-zinc-400"
                      )}>
                        <Clock3 className="w-3.5 h-3.5" />
                        {format(callDate, 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleStatus(f);
                    }}
                    className="shrink-0 transition-transform active:scale-90"
                  >
                    {f.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className="w-6 h-6 text-zinc-300 group-hover:text-zinc-400" />
                    )}
                  </button>
                </div>

                {f.notes && (
                  <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 relative group/notes">
                    <MessageSquare className="w-3 h-3 text-zinc-300 absolute top-3 right-3" />
                    <p className="text-xs text-zinc-600 leading-relaxed italic line-clamp-3">
                      "{f.notes}"
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-auto p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEditFollowup(f)} className="w-8 h-8 rounded-xl text-zinc-400 hover:text-zinc-900 group-hover:bg-white">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteFollowup(f.id)} className="w-8 h-8 rounded-xl text-zinc-400 hover:text-red-600 group-hover:bg-white">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="secondary" className="h-8 rounded-xl text-[10px] font-bold px-3">
                  <User className="w-3.5 h-3.5 mr-2" />
                  Profile
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredFollowups.length === 0 && (
          <div className="lg:col-span-3 py-24 flex flex-col items-center justify-center text-zinc-400 bg-white border border-zinc-100 rounded-3xl">
            <PhoneCall className="w-16 h-16 mb-4 opacity-5" />
            <p className="font-bold tracking-tight">No follow-ups found</p>
            <p className="text-sm">Keep your connections alive by scheduling some calls!</p>
          </div>
        )}
      </section>
    </div>
  );
}
