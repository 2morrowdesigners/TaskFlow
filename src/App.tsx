import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  deleteField,
  setDoc
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { isBefore, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Menu, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  TriangleAlert,
  Search
} from 'lucide-react';

import { db, auth } from './firebase';
import { Task, Followup, Category, OperationType } from './types';
import { cn } from './lib/utils';
import { handleFirestoreError, stripId } from './lib/firebase-utils';

// UI Components
import { Button } from './components/ui/Button';

// Layout Components
import { Navigation } from './components/layout/Navigation';

// View Components
import { Dashboard } from './components/dashboard/Dashboard';
import { TaskList } from './components/tasks/TaskList';
import { FollowupList } from './components/followups/FollowupList';
import { CalendarView } from './components/calendar/CalendarView';
import { CategoryList } from './components/categories/CategoryList';
import { AccountSettings } from './components/settings/AccountSettings';
import { TaskHistory } from './components/tasks/TaskHistory';
import { FollowupHistory } from './components/followups/FollowupHistory';

// Action Components
import { TaskModal } from './components/tasks/TaskModal';
import { FollowupModal } from './components/followups/FollowupModal';
import { CategoryModal } from './components/categories/CategoryModal';
import { FocusSession } from './components/dashboard/FocusSession';
import { LoginForm } from './components/auth/LoginForm';
import { NotificationModal } from './components/notifications/NotificationModal';
import { ErrorBoundary } from './components/ErrorBoundary';

type Tab = 'dashboard' | 'tasks' | 'followups' | 'categories' | 'calendar' | 'account-settings' | 'task-history' | 'followup-history';

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFocusSessionOpen, setIsFocusSessionOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingFollowup, setEditingFollowup] = useState<Followup | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
  const [overdueAlerts, setOverdueAlerts] = useState<(Task | Followup)[]>([]);

  // Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Sync
  useEffect(() => {
    if (!user) return;

    const tasksQuery = query(collection(db, 'tasks'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
    const followupsQuery = query(collection(db, 'followups'), where('uid', '==', user.uid), orderBy('followupDate', 'asc'));
    const categoriesQuery = query(collection(db, 'categories'), where('uid', '==', user.uid));

    const unsubTasks = onSnapshot(tasksQuery, (snap) => {
      setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'tasks'));

    const unsubFollowups = onSnapshot(followupsQuery, (snap) => {
      setFollowups(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Followup)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'followups'));

    const unsubCats = onSnapshot(categoriesQuery, (snap) => {
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'categories'));

    return () => {
      unsubTasks();
      unsubFollowups();
      unsubCats();
    };
  }, [user]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Notification Handler
  useEffect(() => {
    if (!user || tasks.length === 0) return;
    
    const checkOverdue = () => {
      const now = new Date();
      const newAlerts: (Task | Followup)[] = [];

      tasks.forEach(task => {
        if (task.status !== 'completed' && !task.notified && task.dueDate) {
          if (isBefore(new Date(task.dueDate), now)) {
            newAlerts.push(task);
          }
        }
      });

      followups.forEach(f => {
        if (f.status !== 'completed' && !f.notified && f.followupDate) {
          if (isBefore(new Date(f.followupDate), now)) {
            newAlerts.push(f);
          }
        }
      });

      if (newAlerts.length > 0) {
        setOverdueAlerts(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const uniqueNew = newAlerts.filter(a => !existingIds.has(a.id));
          return [...prev, ...uniqueNew];
        });
      }
    };

    const interval = setInterval(checkOverdue, 15 * 60 * 1000); // Check every 15 mins to save battery/perf, or 15s for "real-time"
    checkOverdue();
    return () => clearInterval(interval);
  }, [tasks, followups, user]);

  // Auth Handlers
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login failed', err);
      setToast({ message: 'Authentication failed', type: 'error' });
    }
  };

  const handleEmailLogin = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      console.error('Login failed', err);
      setToast({ message: 'Invalid credentials', type: 'error' });
    }
  };

  const handleLogout = () => signOut(auth);

  // Firestore Operations
  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (!user) return;
    try {
      const cleanData: any = stripId(taskData);
      if (cleanData.dueDate === '') delete cleanData.dueDate;
      if (cleanData.category === '') delete cleanData.category;
      if (cleanData.description === '') delete cleanData.description;

      if (editingTask) {
        const updatePayload: any = { 
          ...cleanData, 
          updatedAt: new Date().toISOString() 
        };
        if (taskData.status === 'completed' && editingTask.status !== 'completed') {
          updatePayload.completedAt = new Date().toISOString();
        } else if (taskData.status !== 'completed' && editingTask.status === 'completed') {
          updatePayload.completedAt = deleteField();
        }

        if (editingTask.dueDate && !cleanData.dueDate) updatePayload.dueDate = deleteField();
        if (editingTask.category && !cleanData.category) updatePayload.category = deleteField();
        if (editingTask.description && !cleanData.description) updatePayload.description = deleteField();

        updatePayload.uid = user.uid;
        await updateDoc(doc(db, 'tasks', editingTask.id), updatePayload);
        setToast({ message: 'Task updated', type: 'success' });
      } else {
        await addDoc(collection(db, 'tasks'), {
          ...cleanData,
          uid: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          notified: false
        });
        setToast({ message: 'Task created', type: 'success' });
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'tasks');
      setToast({ message: 'Operation failed', type: 'error' });
    }
  };

  const handleToggleTask = async (task: Task) => {
    if (!user) return;
    try {
      const newStatus = task.status !== 'completed' ? 'completed' : 'pending';
      const updatePayload: any = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      if (newStatus === 'completed') {
        updatePayload.completedAt = new Date().toISOString();
      } else {
        updatePayload.completedAt = deleteField();
      }
      
      console.log('Toggling task', task.id, 'to', newStatus);
      await updateDoc(doc(db, 'tasks', task.id), updatePayload);
    } catch (err: any) {
      console.error('Toggle task error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `tasks/${task.id}`);
      setToast({ message: `Update failed: ${err.message}`, type: 'error' });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      setToast({ message: 'Task deleted', type: 'success' });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `tasks/${id}`);
      setToast({ message: 'Delete failed', type: 'error' });
    }
  };

  const handleSaveFollowup = async (fData: Partial<Followup>) => {
    if (!user) return;
    try {
      const cleanData: any = stripId(fData);
      if (cleanData.notes === '') delete cleanData.notes;

      if (editingFollowup) {
        const updatePayload: any = { 
          ...cleanData, 
          updatedAt: new Date().toISOString() 
        };
        if (fData.status === 'completed' && editingFollowup.status !== 'completed') {
          updatePayload.completedAt = new Date().toISOString();
        } else if (fData.status !== 'completed' && editingFollowup.status === 'completed') {
          updatePayload.completedAt = deleteField();
        }
        
        if (editingFollowup.notes && !cleanData.notes) updatePayload.notes = deleteField();

        updatePayload.uid = user.uid;
        await updateDoc(doc(db, 'followups', editingFollowup.id), updatePayload);
        setToast({ message: 'Follow-up updated', type: 'success' });
      } else {
        await addDoc(collection(db, 'followups'), {
          ...cleanData,
          uid: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          notified: false
        });
        setToast({ message: 'Follow-up scheduled', type: 'success' });
      }
      setIsFollowupModalOpen(false);
      setEditingFollowup(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'followups');
      setToast({ message: 'Operation failed', type: 'error' });
    }
  };

  const handleToggleFollowup = async (f: Followup) => {
    if (!user) return;
    try {
      const newStatus = f.status !== 'completed' ? 'completed' : 'scheduled';
      const updatePayload: any = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      if (newStatus === 'completed') {
        updatePayload.completedAt = new Date().toISOString();
      } else {
        updatePayload.completedAt = deleteField();
      }
      
      console.log('Toggling followup', f.id, 'to', newStatus);
      await updateDoc(doc(db, 'followups', f.id), updatePayload);
    } catch (err: any) {
      console.error('Toggle followup error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `followups/${f.id}`);
      setToast({ message: `Update failed: ${err.message}`, type: 'error' });
    }
  };

  const handleDeleteFollowup = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'followups', id));
      setToast({ message: 'Follow-up deleted', type: 'success' });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `followups/${id}`);
      setToast({ message: 'Delete failed', type: 'error' });
    }
  };

  const handleSaveCategory = async (catData: Partial<Category>) => {
    if (!user) return;
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), { ...stripId(catData), uid: user.uid });
        setToast({ message: 'Tag updated', type: 'success' });
      } else {
        await addDoc(collection(db, 'categories'), { ...stripId(catData), uid: user.uid });
        setToast({ message: 'Tag created', type: 'success' });
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'categories');
      setToast({ message: 'Operation failed', type: 'error' });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      setToast({ message: 'Tag deleted', type: 'success' });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
      setToast({ message: 'Delete failed', type: 'error' });
    }
  };

  const isCompletedBeforeToday = (item: Task | Followup) => {
    if (item.status !== 'completed') return false;
    const dateStr = item.completedAt || item.updatedAt;
    if (!dateStr) return true;
    return !isToday(new Date(dateStr));
  };

  const activeTasks = tasks.filter(t => !isCompletedBeforeToday(t));
  const historyTasks = tasks.filter(t => isCompletedBeforeToday(t));
  
  const activeFollowups = followups.filter(f => !isCompletedBeforeToday(f));
  const historyFollowups = followups.filter(f => isCompletedBeforeToday(f));

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white"
        >
          <Zap className="w-12 h-12 fill-current" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onGoogleLogin={handleGoogleLogin} onEmailLogin={handleEmailLogin} />;
  }

  return (
    <div className="flex h-screen bg-zinc-50 font-sans selection:bg-zinc-950 selection:text-white overflow-hidden">
      {/* Desktop Navigation */}
      <aside className="hidden lg:block w-72 h-full flex-shrink-0 z-40 border-r border-zinc-100">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
        />
      </aside>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 h-full"
            >
              <Navigation 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={handleLogout} 
                isMobile
                onClose={() => setIsMobileMenuOpen(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-12 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden rounded-2xl">
              <Menu className="w-6 h-6" />
            </Button>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="bg-zinc-100 border-none rounded-2xl h-11 w-64 pl-11 text-sm focus:ring-2 focus:ring-zinc-950 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsNotificationModalOpen(true)}
                className={cn(
                  "w-11 h-11 rounded-2xl relative transition-all group overflow-hidden bg-zinc-50 border border-zinc-100",
                  overdueAlerts.length > 0 && "animate-pulse border-red-100 bg-red-50/50 shadow-lg shadow-red-200/50"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-zinc-200/20 group-hover:to-zinc-200/40 transition-all" />
                <Bell className={cn(
                  "w-5 h-5 transition-transform group-hover:rotate-12 relative z-10",
                  overdueAlerts.length > 0 ? "text-red-500" : "text-zinc-500"
                )} />
                {overdueAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-950 text-[10px] font-black text-white flex items-center justify-center rounded-full ring-4 ring-red-50 relative z-20">
                    {overdueAlerts.length}
                  </span>
                )}
              </Button>
            </div>
            
            <div className="h-10 w-px bg-zinc-100 mx-2 hidden sm:block" />
            
            <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl border border-zinc-100 shadow-sm cursor-pointer hover:border-zinc-300 transition-all">
              <div className="w-9 h-9 border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 flex items-center justify-center shrink-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Zap className="w-4 h-4 text-zinc-400" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-zinc-900 leading-none">{user.displayName || 'Guest'}</p>
                <p className="text-[10px] font-medium text-zinc-400 mt-0.5 leading-none">Enterprise User</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  tasks={activeTasks} 
                  followups={activeFollowups} 
                  categories={categories}
                  onAddTask={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
                  onAddFollowup={() => { setEditingFollowup(null); setIsFollowupModalOpen(true); }}
                  onFocusTask={(t) => { setFocusTask(t); setIsFocusSessionOpen(true); }}
                  onViewAllTasks={() => setActiveTab('tasks')}
                />
              )}
              {activeTab === 'tasks' && (
                <TaskList 
                  tasks={activeTasks}
                  categories={categories}
                  onAddTask={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
                  onEditTask={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
                  onDeleteTask={handleDeleteTask}
                  onToggleStatus={handleToggleTask}
                  onFocusTask={(t) => { setFocusTask(t); setIsFocusSessionOpen(true); }}
                  onViewHistory={() => setActiveTab('task-history')}
                />
              )}
              {activeTab === 'task-history' && (
                <TaskHistory 
                  tasks={historyTasks}
                  categories={categories}
                  onBack={() => setActiveTab('tasks')}
                  onDeleteTask={handleDeleteTask}
                />
              )}
              {activeTab === 'followups' && (
                <FollowupList 
                  followups={activeFollowups}
                  onAddFollowup={() => { setEditingFollowup(null); setIsFollowupModalOpen(true); }}
                  onEditFollowup={(f) => { setEditingFollowup(f); setIsFollowupModalOpen(true); }}
                  onDeleteFollowup={handleDeleteFollowup}
                  onToggleStatus={handleToggleFollowup}
                  onViewHistory={() => setActiveTab('followup-history')}
                />
              )}
              {activeTab === 'followup-history' && (
                <FollowupHistory 
                  followups={historyFollowups}
                  onBack={() => setActiveTab('followups')}
                  onDeleteFollowup={handleDeleteFollowup}
                />
              )}
              {activeTab === 'calendar' && (
                <CalendarView 
                  tasks={activeTasks} 
                  followups={activeFollowups}
                  onEditTask={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
                  onEditFollowup={(f) => { setEditingFollowup(f); setIsFollowupModalOpen(true); }}
                />
              )}
              {activeTab === 'categories' && (
                <CategoryList 
                  categories={categories}
                  onAddCategory={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
                  onEditCategory={(c) => { setEditingCategory(c); setIsCategoryModalOpen(true); }}
                  onDeleteCategory={handleDeleteCategory}
                />
              )}
              {activeTab === 'account-settings' && <AccountSettings user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onSave={handleSaveTask}
        editingTask={editingTask}
        categories={categories}
      />
      <FollowupModal 
        isOpen={isFollowupModalOpen} 
        onClose={() => setIsFollowupModalOpen(false)} 
        onSave={handleSaveFollowup}
        editingFollowup={editingFollowup}
      />
      <CategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />
      
      <NotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        alerts={overdueAlerts}
        onClear={() => setOverdueAlerts([])}
      />

      <AnimatePresence>
        {isFocusSessionOpen && (
          <FocusSession 
            task={focusTask}
            onClose={() => setIsFocusSessionOpen(false)}
            onComplete={() => {
              setIsFocusSessionOpen(false);
              if (focusTask) handleToggleTask(focusTask);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={cn(
              "fixed bottom-8 right-8 z-[250] flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl border bg-zinc-900 border-zinc-800 text-white"
            )}
          >
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            <span className="font-bold text-sm tracking-tight">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
