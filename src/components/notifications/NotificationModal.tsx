import React from 'react';
import { Modal } from '../ui/Modal';
import { Task, Followup } from '../../types';
import { AlertCircle, Clock3, Tag, PhoneCall, ListTodo, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: (Task | Followup)[];
  onClear: () => void;
}

export function NotificationModal({ isOpen, onClose, alerts, onClear }: NotificationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      footer={
        <Button variant="secondary" onClick={onClear} disabled={alerts.length === 0} className="rounded-2xl">
          Clear All
        </Button>
      }
    >
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const isTask = 'title' in alert;
            const date = isTask ? alert.dueDate : alert.followupDate;
            
            return (
              <div key={alert.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isTask ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  {isTask ? <ListTodo className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-bold text-zinc-900 truncate">
                      {isTask ? alert.title : `Call: ${alert.contactName}`}
                    </p>
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter">
                      Overdue
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {date && (
                      <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-1">
                        <Clock3 className="w-3 h-3" />
                        {format(new Date(date), 'MMM d, h:mm a')}
                      </span>
                    )}
                    {isTask && alert.category && (
                      <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {alert.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-zinc-400">
            <CheckCircle2 className="w-12 h-12 mb-4 opacity-10" />
            <p className="text-sm font-medium">All caught up! No active alerts.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
