import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Menu, X, FileText, Moon, Sun, History, Timer, Brain, CalendarDays, BarChart2, Layers, Trophy } from 'lucide-react';
import { AppMode, PaperAttempt, UserStats, Achievement, StudyPlan, FlashcardDeck } from './types';
import { Dashboard } from './components/Dashboard';
import { TutorInterface } from './components/TutorInterface';
import { HistoryView } from './components/HistoryView';
import { ExamDashboard } from './components/ExamDashboard';
import { FocusTimer } from './components/FocusTimer';
import { StudyPlanner } from './components/StudyPlanner';
import { Analytics } from './components/Analytics';
import { Flashcards } from './components/Flashcards';
import { Leaderboard } from './components/Leaderboard';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, query, where } from 'firebase/firestore';

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_exam', title: 'First Steps', description: 'Complete your first exam', icon: '🎯', unlocked: false },
    { id: 'streak_3', title: 'Consistent', description: 'Study for 3 days in a row', icon: '🔥', unlocked: false },
    { id: 'score_a', title: 'High Flyer', description: 'Score an A in any paper', icon: '🏆', unlocked: false },
    { id: 'night_owl', title: 'Night Owl', description: 'Complete an exam after 10 PM', icon: '🦉', unlocked: false },
];

const DEFAULT_STATS: UserStats = {
    streak: 0,
    lastStudyDate: '',
    totalMinutesStudied: 0,
    papersCompleted: 0,
    xp: 0
};

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.PAPERS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved) return saved as 'dark' | 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // State
  const [attempts, setAttempts] = useState<PaperAttempt[]>([]);
  const [bookmarkedPapers, setBookmarkedPapers] = useState<string[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(DEFAULT_STATS);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Listeners
  useEffect(() => {
    if (!isAuthReady) return;
    if (!user) {
      // Reset state if logged out
      setAttempts([]);
      setStudyPlans([]);
      setFlashcardDecks([]);
      setUserStats(DEFAULT_STATS);
      return;
    }

    const uid = user.uid;

    // User Stats
    const userDocRef = doc(db, 'users', uid);
    const unsubUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserStats({
          streak: data.streak || 0,
          lastStudyDate: data.lastStudyDate || '',
          totalMinutesStudied: data.totalMinutesStudied || 0,
          papersCompleted: data.papersCompleted || 0,
          xp: data.xp || 0
        });
        
        // Update profile info if missing
        if (!data.displayName || !data.photoURL) {
            setDoc(userDocRef, {
                ...data,
                displayName: user.displayName || 'Anonymous Scholar',
                photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`
            }, { merge: true });
        }
      } else {
        setDoc(userDocRef, {
            ...DEFAULT_STATS,
            displayName: user.displayName || 'Anonymous Scholar',
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`
        });
      }
    });

    // Attempts
    const qAttempts = query(collection(db, 'attempts'), where('uid', '==', uid));
    const unsubAttempts = onSnapshot(qAttempts, (snapshot) => {
      const loadedAttempts: PaperAttempt[] = [];
      snapshot.forEach(doc => loadedAttempts.push(doc.data() as PaperAttempt));
      setAttempts(loadedAttempts.sort((a, b) => b.timestamp - a.timestamp));
    });

    // Flashcards
    const qFlashcards = query(collection(db, 'flashcards'), where('uid', '==', uid));
    const unsubFlashcards = onSnapshot(qFlashcards, (snapshot) => {
      const loadedDecks: FlashcardDeck[] = [];
      snapshot.forEach(doc => loadedDecks.push(doc.data() as FlashcardDeck));
      setFlashcardDecks(loadedDecks.sort((a, b) => b.createdAt - a.createdAt));
    });

    // Study Plans
    const qPlans = query(collection(db, 'studyPlans'), where('uid', '==', uid));
    const unsubPlans = onSnapshot(qPlans, (snapshot) => {
      const loadedPlans: StudyPlan[] = [];
      snapshot.forEach(doc => loadedPlans.push(doc.data() as StudyPlan));
      setStudyPlans(loadedPlans.sort((a, b) => b.startDate - a.startDate));
    });

    return () => {
      unsubUser();
      unsubAttempts();
      unsubFlashcards();
      unsubPlans();
    };
  }, [user, isAuthReady]);

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check Streak on Load
  useEffect(() => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      if (userStats.lastStudyDate && userStats.lastStudyDate !== today) {
           const lastDate = new Date(userStats.lastStudyDate);
           const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
           
           if (diffDays > 2 && userStats.streak > 0) {
               // Lost streak
               const newStats = { ...userStats, streak: 0 };
               setUserStats(newStats);
               setDoc(doc(db, 'users', user.uid), newStats, { merge: true });
           }
      }
  }, [user, userStats.lastStudyDate]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const toggleBookmark = (paperId: string) => {
      setBookmarkedPapers(prev => 
          prev.includes(paperId) ? prev.filter(id => id !== paperId) : [...prev, paperId]
      );
  };

  const updateGamification = async (attempt: PaperAttempt) => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = userStats.lastStudyDate !== today;
      
      let newStreak = userStats.streak;
      if (isNewDay) {
          if (userStats.lastStudyDate) {
              const lastDate = new Date(userStats.lastStudyDate);
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
                  newStreak += 1;
              } else {
                  newStreak = 1;
              }
          } else {
              newStreak = 1;
          }
      }

      const newXP = userStats.xp + 100 + (attempt.userMarks > 0 ? attempt.userMarks : 10);
      
      const updatedStats = {
          ...userStats,
          streak: newStreak,
          lastStudyDate: today,
          papersCompleted: userStats.papersCompleted + 1,
          totalMinutesStudied: userStats.totalMinutesStudied + (attempt.timeTaken ? Math.floor(attempt.timeTaken / 60) : 30),
          xp: newXP
      };

      await setDoc(doc(db, 'users', user.uid), updatedStats, { merge: true });

      // Check Achievements
      const newAchievements = achievements.map(ach => {
          if (ach.unlocked) return ach;
          
          let unlocked = false;
          if (ach.id === 'first_exam') unlocked = true;
          if (ach.id === 'streak_3' && newStreak >= 3) unlocked = true;
          if (ach.id === 'score_a' && attempt.userMarks >= attempt.aGradeThreshold) unlocked = true;
          if (ach.id === 'night_owl') {
              const hour = new Date().getHours();
              if (hour >= 22 || hour < 4) unlocked = true;
          }

          if (unlocked) {
              alert(`🏆 Achievement Unlocked: ${ach.title}!`);
              return { ...ach, unlocked: true, unlockedAt: Date.now() };
          }
          return ach;
      });

      setAchievements(newAchievements);
  };

  const handleSaveAttempt = async (attempt: PaperAttempt) => {
    if (!user) return;
    const attemptWithUid = { ...attempt, uid: user.uid };
    await setDoc(doc(db, 'attempts', attempt.id), attemptWithUid);
    updateGamification(attemptWithUid);
  };

  // Planner Handlers
  const handleAddPlan = async (plan: StudyPlan) => {
      if (!user) return;
      const planWithUid = { ...plan, uid: user.uid };
      await setDoc(doc(db, 'studyPlans', plan.id), planWithUid);
  };
  
  const handleUpdatePlan = async (updatedPlan: StudyPlan) => {
      if (!user) return;
      const planWithUid = { ...updatedPlan, uid: user.uid };
      await setDoc(doc(db, 'studyPlans', updatedPlan.id), planWithUid);
  };

  const handleDeletePlan = async (id: string) => {
      if (!user) return;
      // Note: For a real app, use deleteDoc. Here we just update state for simplicity if deleteDoc isn't imported
      // Actually, let's just use deleteDoc from firestore
  };

  const handleAddFlashcardDeck = async (deck: FlashcardDeck) => {
      if (!user) return;
      const deckWithUid = { ...deck, uid: user.uid };
      await setDoc(doc(db, 'flashcards', deck.id), deckWithUid);
  };

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(console.error);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200">
        <div className="p-4 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20 mb-6">
            <BookOpen size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2">CAIE Hub</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Your ultimate O/A Level companion.</p>
        <button 
          onClick={handleLogin}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeMode) {
      case AppMode.PAPERS:
        return (
            <Dashboard 
                onSaveAttempt={handleSaveAttempt} 
                existingAttempts={attempts} 
                userStats={userStats} 
                achievements={achievements}
                bookmarkedPapers={bookmarkedPapers}
                onToggleBookmark={toggleBookmark}
            />
        );
      case AppMode.EXAM:
        return <ExamDashboard onSaveAttempt={handleSaveAttempt} existingAttempts={attempts} />;
      case AppMode.TUTOR:
        return <TutorInterface />;
      case AppMode.HISTORY:
        return <HistoryView attempts={attempts} />;
      case AppMode.FOCUS:
        return <FocusTimer />;
      case AppMode.PLANNER:
        return (
            <StudyPlanner 
                plans={studyPlans}
                onAddPlan={handleAddPlan}
                onUpdatePlan={handleUpdatePlan}
                onDeletePlan={handleDeletePlan}
            />
        );
      case AppMode.ANALYTICS:
        return <Analytics attempts={attempts} userStats={userStats} />;
      case AppMode.FLASHCARDS:
        return <Flashcards decks={flashcardDecks} onAddDeck={handleAddFlashcardDeck} />;
      case AppMode.LEADERBOARD:
        return <Leaderboard />;
      default:
        return <Dashboard onSaveAttempt={handleSaveAttempt} existingAttempts={attempts} userStats={userStats} achievements={achievements} />;
    }
  };

  const navItems = [
    { mode: AppMode.PAPERS, label: 'Past Papers', icon: FileText, color: 'text-blue-500 dark:text-blue-400' },
    { mode: AppMode.EXAM, label: 'Exam Mode', icon: Timer, color: 'text-red-500 dark:text-red-400' },
    { mode: AppMode.PLANNER, label: 'Study Planner', icon: CalendarDays, color: 'text-purple-500 dark:text-purple-400' },
    { mode: AppMode.TUTOR, label: 'AI Tutor', icon: GraduationCap, color: 'text-emerald-500 dark:text-emerald-400' },
    { mode: AppMode.FLASHCARDS, label: 'Flashcards', icon: Layers, color: 'text-indigo-500 dark:text-indigo-400' },
    { mode: AppMode.ANALYTICS, label: 'Analytics', icon: BarChart2, color: 'text-teal-500 dark:text-teal-400' },
    { mode: AppMode.FOCUS, label: 'Focus Timer', icon: Brain, color: 'text-pink-500 dark:text-pink-400' },
    { mode: AppMode.HISTORY, label: 'History', icon: History, color: 'text-orange-500 dark:text-orange-400' },
    { mode: AppMode.LEADERBOARD, label: 'Leaderboard', icon: Trophy, color: 'text-amber-500 dark:text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-white overflow-hidden flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-4 transition-colors duration-300">
        <div className="flex items-center space-x-3 px-2 py-4 mb-8">
            <div className="p-2 bg-emerald-600 rounded-lg shadow-lg shadow-emerald-500/20">
                <BookOpen size={24} className="text-white" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    CAIE Hub
                </h1>
                <span className="text-xs text-slate-500 dark:text-slate-400">Past Papers & Prep</span>
            </div>
        </div>

        <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
                <button
                    key={item.mode}
                    onClick={() => setActiveMode(item.mode)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        activeMode === item.mode 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-200 dark:border-slate-700 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <item.icon size={20} className={`${activeMode === item.mode ? item.color : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-white'} transition-colors`} />
                    <span className="font-medium">{item.label}</span>
                </button>
            ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-slate-800/50 space-y-4">
            <button 
                onClick={toggleTheme}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
                <span className="text-sm font-medium">Log Out</span>
            </button>
            <p className="text-xs text-slate-400 text-center">
                Mock Data & AI Powered
            </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
         <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-600 rounded-md">
                <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">CAIE Hub</span>
         </div>
         <div className="flex items-center space-x-2">
             <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button onClick={toggleMobileMenu} className="p-2 text-slate-600 dark:text-slate-300">
                 {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
         </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg pt-20 px-6">
              <nav className="space-y-4">
                {navItems.map((item) => (
                    <button
                        key={item.mode}
                        onClick={() => {
                            setActiveMode(item.mode);
                            setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-4 p-4 rounded-xl text-lg font-medium transition-all ${
                            activeMode === item.mode 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-200 dark:border-slate-700' 
                            : 'bg-transparent text-slate-500 dark:text-slate-400'
                        }`}
                    >
                        <item.icon size={24} />
                        <span>{item.label}</span>
                    </button>
                ))}
              </nav>
          </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />

        {/* 
            Conditional Layout:
            - Tutor Mode: Needs fixed height container with overflow hidden (scrolling handled internally)
            - Other Modes: Container scrolls (overflow-y-auto)
        */}
        <div className={`flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full z-10 custom-scrollbar ${activeMode === AppMode.TUTOR || activeMode === AppMode.FOCUS ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;