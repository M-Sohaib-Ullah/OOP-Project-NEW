import React, { useState, useEffect, useMemo } from 'react';
import { SUBJECTS, generateMockPapers } from '../services/mockData';
import { PastPaper, Subject, DifficultyLevel, PaperAttempt, UserStats, Achievement } from '../types';
import { PaperCard } from './PaperCard';
import { Search, Filter, BookOpen, GraduationCap, Calendar, Layers, Hash, Info, CheckCircle2, Flame, Award, Star, BarChart3, LayoutTemplate } from 'lucide-react';

interface DashboardProps {
    onSaveAttempt?: (attempt: PaperAttempt) => void;
    existingAttempts?: PaperAttempt[];
    userStats?: UserStats;
    achievements?: Achievement[];
    bookmarkedPapers?: string[];
    onToggleBookmark?: (paperId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSaveAttempt, existingAttempts = [], userStats, achievements, bookmarkedPapers = [], onToggleBookmark }) => {
  const [selectedLevel, setSelectedLevel] = useState<'O Level' | 'A Level'>('A Level');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(SUBJECTS[0].id);
  const [papers, setPapers] = useState<PastPaper[]>([]);
  
  // View Mode: 'browse' uses general filters, 'search' uses specific fields
  const [viewMode, setViewMode] = useState<'browse' | 'search'>('browse');

  // Toggle View State
  const [activeTab, setActiveTab] = useState<'stats' | 'filters'>('filters');

  // Browse Filters
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'All'>('All');
  const [yearRange, setYearRange] = useState<[number, number]>([2010, 2024]);
  const [sessionFilter, setSessionFilter] = useState<'All' | 'May/June' | 'Oct/Nov'>('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Quick Search State
  const [searchYear, setSearchYear] = useState<string>('2024');
  const [searchSession, setSearchSession] = useState<'May/June' | 'Oct/Nov'>('May/June');
  const [searchVariant, setSearchVariant] = useState<string>('');

  // Load papers when subject changes
  useEffect(() => {
    const loadedPapers = generateMockPapers(selectedSubjectId);
    setPapers(loadedPapers);
  }, [selectedSubjectId]);

  // Filter Logic
  const filteredPapers = useMemo(() => {
    let result = papers;

    if (viewMode === 'search') {
        result = result.filter(p => {
            const y = parseInt(searchYear);
            const v = parseInt(searchVariant);
            
            // Year check (if provided, otherwise loose)
            const matchYear = !isNaN(y) ? p.year === y : true;
            const matchSession = p.session === searchSession;
            // Variant check (if provided)
            const matchVariant = !isNaN(v) ? p.variant === v : true;

            return matchYear && matchSession && matchVariant;
        });
    } else {
        // Default Browse Filter Logic
        result = result.filter(p => {
            const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
            const matchesYear = p.year >= yearRange[0] && p.year <= yearRange[1];
            const matchesSession = sessionFilter === 'All' || p.session === sessionFilter;
            return matchesDiff && matchesYear && matchesSession;
        });
    }

    if (showSavedOnly) {
        result = result.filter(p => bookmarkedPapers.includes(p.id));
    }

    return result.sort((a, b) => {
        // Sort by year desc by default, then session
        if (b.year !== a.year) return b.year - a.year;
        return a.session.localeCompare(b.session);
    });
  }, [papers, viewMode, difficultyFilter, yearRange, sessionFilter, searchYear, searchSession, searchVariant, showSavedOnly, bookmarkedPapers]);

  const currentSubject = SUBJECTS.find(s => s.id === selectedSubjectId);
  const subjectsByLevel = SUBJECTS.filter(s => s.level === selectedLevel);
  const unlockedAchievements = achievements?.filter(a => a.unlocked) || [];

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* View Toggle */}
      <div className="flex justify-between items-center">
          <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <button 
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
            >
                <BarChart3 size={16} />
                Stats
            </button>
            <button 
                onClick={() => setActiveTab('filters')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'filters' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
            >
                <LayoutTemplate size={16} />
                Filters
            </button>
          </div>

          {/* Context indicator if filters hidden */}
          {activeTab === 'stats' && (
              <div className="text-xs text-slate-400 font-medium hidden sm:block">
                  Showing results for {currentSubject?.name}
              </div>
          )}
      </div>

      {/* Gamification Summary Banner */}
      {activeTab === 'stats' && userStats && (
        <div className="grid grid-cols-3 gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-lg animate-in fade-in slide-in-from-top-4">
             <div className="flex flex-col items-center justify-center p-2 border-r border-slate-700/50">
                <div className="flex items-center gap-2 mb-2 text-orange-400">
                    <Flame size={24} fill="currentColor" />
                    <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
                </div>
                <span className="text-3xl font-bold">{userStats.streak} Days</span>
             </div>
             <div className="flex flex-col items-center justify-center p-2 border-r border-slate-700/50">
                <div className="flex items-center gap-2 mb-2 text-yellow-400">
                    <Star size={24} fill="currentColor" />
                    <span className="text-xs font-bold uppercase tracking-wider">Total XP</span>
                </div>
                <span className="text-3xl font-bold">{userStats.xp}</span>
             </div>
             <div className="flex flex-col items-center justify-center p-2">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                    <Award size={24} fill="currentColor" />
                    <span className="text-xs font-bold uppercase tracking-wider">Badges</span>
                </div>
                <span className="text-3xl font-bold">{unlockedAchievements.length}</span>
             </div>
        </div>
      )}

      {/* Header & Controls */}
      {activeTab === 'filters' && (
      <div className="bg-white/70 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 backdrop-blur-sm shadow-xl dark:shadow-none transition-all duration-300 animate-in fade-in slide-in-from-top-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
             <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <BookOpen className="mr-3 text-emerald-600 dark:text-emerald-500" />
                    Past Paper Archive
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {viewMode === 'browse' ? 'Browse papers by filters' : 'Find a specific paper'}
                </p>
             </div>
             
             {/* Level Switcher */}
             <div className="flex items-center gap-4">
                 <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700">
                    <button 
                        onClick={() => setSelectedLevel('O Level')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedLevel === 'O Level' ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        O Level
                    </button>
                    <button 
                        onClick={() => setSelectedLevel('A Level')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedLevel === 'A Level' ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        A Level
                    </button>
                 </div>
             </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex space-x-1 border-b border-gray-200 dark:border-slate-700 mb-6">
             <button
                onClick={() => setViewMode('browse')}
                className={`pb-2 px-4 text-sm font-medium transition-all relative ${viewMode === 'browse' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
             >
                <div className="flex items-center gap-2">
                    <Filter size={16} />
                    Browse Filters
                </div>
                {viewMode === 'browse' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-t-full" />}
             </button>
             <button
                onClick={() => setViewMode('search')}
                className={`pb-2 px-4 text-sm font-medium transition-all relative ${viewMode === 'search' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
             >
                <div className="flex items-center gap-2">
                    <Search size={16} />
                    Quick Search
                </div>
                {viewMode === 'search' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />}
             </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
            {/* Subject Select (Always Visible) */}
            <div className="w-full">
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Subject</label>
                <select 
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none shadow-sm transition-all"
                >
                    {subjectsByLevel.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                </select>
            </div>

            {viewMode === 'browse' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Difficulty Filter */}
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Difficulty (by Threshold)</label>
                            <select 
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value as any)}
                                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                            >
                                <option value="All">All Difficulties</option>
                                <option value="Very Easy">Very Easy (Threshold &gt;=75%)</option>
                                <option value="Easy">Easy (68-74%)</option>
                                <option value="Medium">Medium (62-67%)</option>
                                <option value="Hard">Hard (56-61%)</option>
                                <option value="Very Hard">Very Hard (&lt;=55%)</option>
                            </select>
                        </div>

                        {/* Session Filter */}
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Session</label>
                            <select 
                                value={sessionFilter}
                                onChange={(e) => setSessionFilter(e.target.value as any)}
                                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                            >
                                <option value="All">All Sessions</option>
                                <option value="May/June">May/June</option>
                                <option value="Oct/Nov">Oct/Nov</option>
                            </select>
                        </div>

                        {/* Year Range */}
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Years: {yearRange[0]} - {yearRange[1]}</label>
                            <input 
                                type="range"
                                min="2010"
                                max="2024"
                                value={yearRange[0]}
                                onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
                                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={() => setShowSavedOnly(!showSavedOnly)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${showSavedOnly ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <Star size={16} className={showSavedOnly ? 'fill-current' : ''} />
                            {showSavedOnly ? 'Showing Saved' : 'Show Saved Only'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50 animate-in fade-in slide-in-from-top-2 duration-300">
                     <div>
                        <label className="text-xs text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                            <Calendar size={12} />
                            Year
                        </label>
                        <input 
                            type="number"
                            placeholder="e.g. 2024"
                            value={searchYear}
                            onChange={(e) => setSearchYear(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm placeholder-slate-400"
                        />
                     </div>
                     <div>
                        <label className="text-xs text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                            <Layers size={12} />
                            Session
                        </label>
                        <select 
                            value={searchSession}
                            onChange={(e) => setSearchSession(e.target.value as any)}
                            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        >
                            <option value="May/June">May/June</option>
                            <option value="Oct/Nov">Oct/Nov</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                            <Hash size={12} />
                            Variant (e.g. 12, 22)
                        </label>
                        <input 
                            type="text"
                            placeholder="Optional"
                            value={searchVariant}
                            onChange={(e) => setSearchVariant(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm placeholder-slate-400"
                        />
                     </div>
                </div>
            )}
        </div>
      </div>
      )}

      {/* Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-4 custom-scrollbar">
        {filteredPapers.map((paper) => (
            <PaperCard 
                key={paper.id} 
                paper={paper} 
                subjectCode={currentSubject?.code || ''}
                subjectName={currentSubject?.name}
                onSaveAttempt={onSaveAttempt}
                previousAttempt={existingAttempts.find(a => a.paperId === paper.id)}
                isBookmarked={bookmarkedPapers.includes(paper.id)}
                onToggleBookmark={onToggleBookmark}
            />
        ))}
        {filteredPapers.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-500">
                <div className="bg-gray-100 dark:bg-slate-800/50 p-6 rounded-full mb-4">
                    <Search size={48} className="opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No papers found</h3>
                <p className="text-sm opacity-70 text-center max-w-md">
                    {viewMode === 'search' 
                        ? `We couldn't find a paper for ${currentSubject?.name} in ${searchSession} ${searchYear} with variant ${searchVariant || 'any'}.`
                        : "Try adjusting your filters to see more results."}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};