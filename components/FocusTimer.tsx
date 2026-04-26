import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Bell } from 'lucide-react';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export const FocusTimer: React.FC = () => {
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
        let interval: number | undefined;
        
        if (isActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer finished
            setIsActive(false);
            if (mode === 'focus') {
                setMode('break');
                setTimeLeft(BREAK_TIME);
                // In a real app we'd play a sound here
            } else {
                setMode('focus');
                setTimeLeft(FOCUS_TIME);
            }
        }
        
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    };

    const switchMode = (newMode: 'focus' | 'break') => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = 100 - (timeLeft / (mode === 'focus' ? FOCUS_TIME : BREAK_TIME)) * 100;

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-slate-700 relative overflow-hidden">
                {/* Background Progress Bar */}
                <div 
                    className={`absolute bottom-0 left-0 h-2 transition-all duration-1000 ease-linear ${mode === 'focus' ? 'bg-indigo-500' : 'bg-green-500'}`}
                    style={{ width: `${progress}%` }}
                />

                <div className="flex justify-center gap-2 mb-8 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl">
                    <button
                        onClick={() => switchMode('focus')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                            mode === 'focus' 
                            ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <Brain size={18} /> Focus
                    </button>
                    <button
                        onClick={() => switchMode('break')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                            mode === 'break' 
                            ? 'bg-white dark:bg-slate-600 text-green-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <Coffee size={18} /> Break
                    </button>
                </div>

                <div className="text-center mb-8 relative">
                    <div className="text-8xl font-mono font-bold text-slate-900 dark:text-white tracking-tighter tabular-nums">
                        {formatTime(timeLeft)}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        {isActive ? (mode === 'focus' ? 'Stay concentrated...' : 'Relax & recharge...') : 'Ready to start?'}
                    </p>
                </div>

                <div className="flex items-center justify-center gap-6">
                    <button 
                        onClick={toggleTimer}
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95 ${
                            isActive 
                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' 
                            : 'bg-indigo-600 text-white dark:bg-indigo-500'
                        }`}
                    >
                        {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </button>
                    
                    <button 
                        onClick={resetTimer}
                        className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>
            
            <div className="mt-8 flex items-center gap-3 text-slate-400 dark:text-slate-500 text-sm">
                <Bell size={14} />
                <span>Timer will ring when time is up</span>
            </div>
        </div>
    );
};