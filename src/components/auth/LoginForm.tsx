import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Mail, Lock, LogIn, Github } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginFormProps {
  onGoogleLogin: () => void;
  onEmailLogin: (email: string, pass: string) => void;
}

export function LoginForm({ onGoogleLogin, onEmailLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'options' | 'email'>('options');

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-200 via-zinc-50 to-zinc-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-zinc-950 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mb-6 shadow-zinc-300">
            <Zap className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-950 mb-2 uppercase">FocusFlow</h1>
          <p className="text-zinc-500 font-medium">Professional workspace for individuals.</p>
        </div>

        <Card className="p-8 space-y-8 shadow-2xl shadow-zinc-200 border-none rounded-[2.5rem]">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-zinc-500">Sign in to sync your professional workspace.</p>
          </div>

          {view === 'options' ? (
            <div className="space-y-3">
              <Button onClick={onGoogleLogin} variant="secondary" className="w-full h-14 rounded-2xl text-base font-bold bg-white hover:bg-zinc-50 border border-zinc-100 shadow-sm transition-all group active:scale-[0.98]">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Sign in with Google
              </Button>
              <Button 
                onClick={() => setView('email')} 
                variant="ghost"
                className="w-full h-14 rounded-2xl text-sm font-bold text-zinc-500 hover:text-zinc-900 active:scale-[0.98]"
              >
                <Mail className="w-5 h-5 mr-3" />
                Continue with Email
              </Button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-2xl bg-zinc-50 border-transparent focus:bg-white focus:ring-0 focus:border-zinc-200"
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-2xl bg-zinc-50 border-transparent focus:bg-white focus:ring-0 focus:border-zinc-200"
                />
              </div>
              <Button 
                onClick={() => onEmailLogin(email, password)}
                className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-zinc-200 active:scale-[0.98]"
              >
                Sign In
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setView('options')} 
                className="w-full text-xs font-bold text-zinc-400"
              >
                Back to options
              </Button>
            </motion.div>
          )}

          <div className="pt-4 border-t border-zinc-50">
            <p className="text-[10px] text-center text-zinc-400 font-medium uppercase tracking-[0.2em] leading-relaxed">
              Secure authentication powered by<br />
              <span className="text-zinc-900 font-black">Professional Enterprise Auth</span>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
