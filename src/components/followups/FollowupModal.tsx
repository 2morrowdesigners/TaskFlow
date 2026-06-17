import React, { useState, useEffect } from 'react';
import { Followup } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Calendar, User, MessageSquare, PhoneCall } from 'lucide-react';

interface FollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (followup: Partial<Followup>) => void;
  editingFollowup: Followup | null;
}

export function FollowupModal({ isOpen, onClose, onSave, editingFollowup }: FollowupModalProps) {
  const [formData, setFormData] = useState<Partial<Followup>>({
    contactName: '',
    notes: '',
    followupDate: new Date().toISOString().slice(0, 16),
    status: 'scheduled',
  });

  useEffect(() => {
    if (editingFollowup) {
      setFormData({
        ...editingFollowup,
        followupDate: editingFollowup.followupDate ? new Date(editingFollowup.followupDate).toISOString().slice(0, 16) : '',
      });
    } else {
      setFormData({
        contactName: '',
        notes: '',
        followupDate: new Date().toISOString().slice(0, 16),
        status: 'scheduled',
      });
    }
  }, [editingFollowup, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingFollowup ? 'Update Call Information' : 'Schedule New Call'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} className="rounded-2xl">Dismiss</Button>
          <Button onClick={handleSubmit} className="rounded-2xl min-w-[140px] font-bold">
            {editingFollowup ? 'Update Log' : 'Schedule Call'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
            <User className="w-3 h-3" />
            Contact Identity
          </label>
          <Input 
            placeholder="Recipient name..." 
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            required
            className="h-14 text-lg font-bold rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            Scheduled Time
          </label>
          <Input 
            type="datetime-local" 
            value={formData.followupDate}
            onChange={(e) => setFormData({ ...formData, followupDate: e.target.value })}
            required
            className="rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
            <MessageSquare className="w-3 h-3" />
            Log Notes
          </label>
          <textarea 
            placeholder="Preparation notes or log details..." 
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full min-h-[140px] p-4 rounded-2xl bg-zinc-50 border-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:bg-white transition-all resize-none"
          />
        </div>
        
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Notification</p>
            <p className="text-[10px] font-medium text-zinc-500">You will receive a professional alert before the call.</p>
          </div>
        </div>
      </form>
    </Modal>
  );
}
