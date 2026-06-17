import React, { useState } from 'react';
import { User, EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User as UserIcon, Shield, Link as LinkIcon, Mail, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AccountSettingsProps {
  user: User;
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const linkAccount = async () => {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(user, credential);
      setMessage({ text: 'Account linked successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to link account', error);
      setMessage({ text: 'Failed to link account. Please check your credentials.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-4xl font-black text-zinc-950 uppercase tracking-tighter mb-2">Settings</h2>
        <p className="text-zinc-500 font-medium tracking-tight">Manage your professional account and security.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 space-y-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full translate-x-12 -translate-y-12" />
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-3xl object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-zinc-900">{user.displayName || 'Professional User'}</h3>
                <p className="text-sm font-medium text-zinc-500">{user.email}</p>
                <div className="flex gap-2 mt-3">
                  {user.providerData.map(p => (
                    <div key={p.providerId} className="px-2.5 py-1 rounded-lg bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-200">
                      {p.providerId}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-zinc-900" />
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Security Audit</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Email Verified</span>
                    <span className={cn("font-bold", user.emailVerified ? "text-emerald-500" : "text-amber-500")}>
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">2FA Status</span>
                    <span className="text-zinc-900 font-bold">Standard</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-zinc-900" />
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Account Access</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Sign-in ID</span>
                    <span className="text-zinc-900 font-bold tabular-nums">#{user.uid.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Account Linking</h3>
                <p className="text-xs text-zinc-500 font-medium">Add email sign-in to your Google identity.</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input 
                    type="email" 
                    placeholder="New credentials email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input 
                    type="password" 
                    placeholder="Secure password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
                  />
                </div>
              </div>
              <Button onClick={linkAccount} className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-zinc-200">
                Link Secure Password Access
              </Button>
            </div>

            {message && (
              <div className={cn(
                "p-4 rounded-2xl text-xs font-bold border",
                message.type === 'error' ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
              )}>
                {message.text}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-6 bg-zinc-950 text-white border-none shadow-2xl relative overflow-hidden">
            <Shield className="absolute top-0 right-0 w-32 h-32 text-white/5 -translate-y-4 translate-x-4" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-4">Security Policy</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                AES-256 Workspace Encryption
              </li>
              <li className="flex items-start gap-3 opacity-60">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                Secure Session Management
              </li>
            </ul>
          </Card>

          <Card className="p-6 border border-red-100 bg-red-50/30">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-red-400 mb-4">Danger Zone</h4>
            <p className="text-xs text-red-600/70 mb-4 leading-relaxed font-medium">Account deletion is permanent. All tasks and follow-up data will be wiped from our secure servers.</p>
            <Button variant="danger" className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none">
              Request Data Purge
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
