import { 
  LayoutDashboard, 
  ListTodo, 
  PhoneCall, 
  Calendar, 
  Settings, 
  Tag, 
  LogOut,
  X,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { motion } from 'motion/react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'followups', label: 'Follow-ups', icon: PhoneCall },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'account-settings', label: 'Settings', icon: Settings },
];

export function Navigation({ activeTab, setActiveTab, onLogout, isMobile, onClose }: NavigationProps) {
  return (
    <div className={cn(
      "flex flex-col h-full bg-white relative",
      !isMobile && "border-r border-zinc-200"
    )}>
      <div className="p-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-zinc-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-zinc-200 ring-4 ring-zinc-50">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-zinc-950 leading-none">FocusFlow</h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Workspace v1.0</p>
          </div>
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl hover:bg-zinc-100">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose?.();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-4 rounded-3xl transition-all duration-500 group relative overflow-hidden",
                isActive 
                  ? "bg-zinc-950 text-white shadow-2xl shadow-zinc-900/40 translate-x-1" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 hover:translate-x-1"
              )}
            >
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "bg-white/10" : "bg-transparent group-hover:bg-zinc-100"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-500",
                    isActive ? "text-white scale-110 rotate-3" : "text-zinc-400 group-hover:text-zinc-950 group-hover:-rotate-3"
                  )} />
                </div>
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-active-accent" 
                    className="ml-auto w-1 h-4 rounded-full bg-white opacity-40"
                  />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-6 space-y-4">
        <div className="bg-zinc-50 rounded-[32px] p-5 border border-zinc-100 relative overflow-hidden group/focus">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-zinc-200/20 rounded-full blur-2xl group-hover/focus:scale-150 transition-transform duration-700" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-zinc-200/50 flex items-center justify-center text-zinc-900 ring-4 ring-zinc-50">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-zinc-950">Focus Level</p>
              <p className="text-[10px] text-zinc-400 font-bold">Pro Account</p>
            </div>
          </div>
          <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden mb-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              className="h-full bg-zinc-950 rounded-full"
            />
          </div>
          <Button variant="secondary" size="sm" className="w-full text-[10px] font-black h-9 rounded-2xl bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all uppercase tracking-widest">
            View Analytics
          </Button>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 text-sm font-bold group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
