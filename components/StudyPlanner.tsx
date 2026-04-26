import React, { useState } from 'react';
import { StudyPlan, StudyTask } from '../types';
import { SUBJECTS } from '../services/mockData';
import { generateAIStudyPlan } from '../services/geminiService';
import { Spinner } from './Spinner';
import { Calendar, CheckCircle2, Circle, Plus, Trash2, ArrowRight, Target, Brain, CalendarDays } from 'lucide-react';

interface StudyPlannerProps {
    plans: StudyPlan[];
    onAddPlan: (plan: StudyPlan) => void;
    onUpdatePlan: (plan: StudyPlan) => void;
    onDeletePlan: (id: string) => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ plans, onAddPlan, onUpdatePlan, onDeletePlan }) => {
    const [isCreating, setIsCreating] = useState(false);
    
    // Form State
    const [subjectId, setSubjectId] = useState(SUBJECTS[0].id);
    const [goal, setGoal] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCreatePlan = async () => {
        if (!goal || !targetDate) {
            alert("Please fill in all fields.");
            return;
        }

        const start = new Date();
        const end = new Date(targetDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (days <= 0) {
            alert("Target date must be in the future.");
            return;
        }
        if (days > 60) {
            alert("Please choose a target date within 60 days for a detailed plan.");
            return;
        }

        setIsGenerating(true);

        const subjectName = SUBJECTS.find(s => s.id === subjectId)?.name || 'General';
        
        try {
            const generatedTasks = await generateAIStudyPlan(subjectName, goal, days);
            
            const newPlan: StudyPlan = {
                id: Date.now().toString(),
                subjectName,
                goal,
                startDate: Date.now(),
                targetDate: end.getTime(),
                tasks: generatedTasks.map((t, idx) => ({
                    id: `task-${Date.now()}-${idx}`,
                    day: t.day,
                    title: t.title,
                    isCompleted: false
                }))
            };

            onAddPlan(newPlan);
            setIsCreating(false);
            setGoal('');
            setTargetDate('');
        } catch (e) {
            alert("Failed to generate plan. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleTask = (plan: StudyPlan, taskId: string) => {
        const updatedTasks = plan.tasks.map(t => 
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        );
        onUpdatePlan({ ...plan, tasks: updatedTasks });
    };

    const calculateProgress = (plan: StudyPlan) => {
        const completed = plan.tasks.filter(t => t.isCompleted).length;
        return Math.round((completed / plan.tasks.length) * 100);
    };

    if (isCreating) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    
                    <div className="mb-6 flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Brain size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create AI Study Plan</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                            <select 
                                value={subjectId}
                                onChange={(e) => setSubjectId(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {SUBJECTS.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal</label>
                            <input 
                                type="text"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                placeholder="e.g. Master Calculus, Finish 5 Past Papers"
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
                            <input 
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                onClick={() => setIsCreating(false)}
                                className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreatePlan}
                                disabled={isGenerating}
                                className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? <Spinner /> : (
                                    <>
                                        Generate Plan <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-6">
             <div className="bg-white/70 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 backdrop-blur-sm shadow-xl dark:shadow-none">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                            <CalendarDays className="mr-3 text-purple-600" />
                            Study Planner
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            AI-generated schedules to help you reach your goals.
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={18} /> New Plan
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-6 pb-20">
                {plans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                        <Target size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">No study plans yet</p>
                        <p className="text-sm">Set a goal and let AI organize your schedule.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {plans.map(plan => {
                            const progress = calculateProgress(plan);
                            const daysLeft = Math.ceil((plan.targetDate - Date.now()) / (1000 * 60 * 60 * 24));
                            const isOverdue = daysLeft < 0;

                            return (
                                <div key={plan.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                    <div className="p-5 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{plan.goal}</h3>
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{plan.subjectName}</span>
                                            </div>
                                            <button 
                                                onClick={() => onDeletePlan(plan.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm mt-3">
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                <Calendar size={14} />
                                                {isOverdue ? (
                                                    <span className="text-red-500 font-medium">Overdue</span>
                                                ) : (
                                                    <span>{daysLeft} days left</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-blue-500 transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 p-4 overflow-y-auto max-h-[300px] custom-scrollbar bg-white dark:bg-slate-800">
                                        <div className="space-y-2">
                                            {plan.tasks.map((task) => (
                                                <div 
                                                    key={task.id} 
                                                    onClick={() => toggleTask(plan, task.id)}
                                                    className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                                        task.isCompleted 
                                                        ? 'bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800' 
                                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                                                    }`}
                                                >
                                                    <div className={`mt-0.5 transition-colors ${task.isCompleted ? 'text-green-500' : 'text-gray-300 dark:text-slate-600 group-hover:text-blue-500'}`}>
                                                        {task.isCompleted ? <CheckCircle2 size={20} className="fill-current" /> : <Circle size={20} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="text-xs font-bold text-slate-400 uppercase mb-0.5 block">Day {task.day}</span>
                                                        <p className={`text-sm ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                                                            {task.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};