import React, { useState, useMemo } from 'react';
import { PaperAttempt } from '../types';
import { Clock, Filter, ChevronDown, ChevronUp, History, Trophy, AlertCircle, Percent, Timer, TrendingUp } from 'lucide-react';

interface HistoryViewProps {
  attempts: PaperAttempt[];
}

type SortOption = 'Year' | 'Correctness';

export const HistoryView: React.FC<HistoryViewProps> = ({ attempts }) => {
  const [sortOption, setSortOption] = useState<SortOption>('Year');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects(prev => ({
        ...prev,
        [subjectName]: !prev[subjectName]
    }));
  };

  const getGradeInfo = (attempt: PaperAttempt) => {
    const percent = (attempt.userMarks / attempt.totalMarks) * 100;
    const aPercent = (attempt.aGradeThreshold / attempt.totalMarks) * 100;

    // Heuristic Grading Logic based on 'A' Threshold
    let grade = 'U';
    if (attempt.userMarks >= attempt.aGradeThreshold) grade = 'A';
    else if (percent >= aPercent - 10) grade = 'B';
    else if (percent >= aPercent - 20) grade = 'C';
    else if (percent >= aPercent - 30) grade = 'D';
    else if (percent >= aPercent - 40) grade = 'E';

    let colorClass = '';
    // Green for A
    if (grade === 'A') {
        colorClass = 'bg-green-100 dark:bg-green-500/20 border-green-200 dark:border-green-500/50 text-green-800 dark:text-green-300';
    } 
    // Yellow for B or C
    else if (grade === 'B' || grade === 'C') {
        colorClass = 'bg-yellow-100 dark:bg-yellow-500/20 border-yellow-200 dark:border-yellow-500/50 text-yellow-800 dark:text-yellow-300';
    } 
    // Red for anything below (D, E, U)
    else {
        colorClass = 'bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-500/50 text-red-800 dark:text-red-300';
    }

    return { grade, colorClass, percent: Math.round(percent) };
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const groupedAttempts = useMemo(() => {
    const grouped: Record<string, PaperAttempt[]> = {};
    
    // Group by Subject Name
    attempts.forEach(attempt => {
        const key = `${attempt.subjectName} (${attempt.subjectCode})`;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(attempt);
    });

    // Sort within groups
    Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => {
            if (sortOption === 'Year') {
                return b.year - a.year;
            } else {
                const gradeA = getGradeInfo(a).percent;
                const gradeB = getGradeInfo(b).percent;
                return gradeB - gradeA;
            }
        });
    });

    return grouped;
  }, [attempts, sortOption]);

  const subjectKeys = Object.keys(groupedAttempts).sort();

  // Simple SVG Line Chart Component
  const renderProgressChart = (subjectAttempts: PaperAttempt[]) => {
      if (subjectAttempts.length < 2) return null;
      
      // Sort chronologically for the chart
      const sorted = [...subjectAttempts].sort((a, b) => a.timestamp - b.timestamp);
      const dataPoints = sorted.map(a => (a.userMarks / a.totalMarks) * 100);
      
      const width = 100;
      const height = 40;
      const maxVal = 100;
      const minVal = 0;
      
      const points = dataPoints.map((val, idx) => {
          const x = (idx / (dataPoints.length - 1)) * width;
          const y = height - ((val - minVal) / (maxVal - minVal)) * height;
          return `${x},${y}`;
      }).join(' ');

      return (
          <div className="w-full h-16 mt-2 mb-4 bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-gray-100 dark:border-slate-800 relative overflow-hidden">
               <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2" className="text-slate-400" strokeWidth="0.5" />
                  <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2" className="text-slate-400" strokeWidth="0.5" />
                  
                  {/* The Line */}
                  <polyline 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      points={points} 
                      className="text-indigo-500 dark:text-indigo-400"
                      vectorEffect="non-scaling-stroke"
                  />
                  
                  {/* Points */}
                  {dataPoints.map((val, idx) => {
                      const x = (idx / (dataPoints.length - 1)) * width;
                      const y = height - ((val - minVal) / (maxVal - minVal)) * height;
                      return (
                          <circle 
                            key={idx} 
                            cx={x} 
                            cy={y} 
                            r="1.5" 
                            className="fill-indigo-600 dark:fill-indigo-300"
                            vectorEffect="non-scaling-stroke" 
                          />
                      );
                  })}
               </svg>
               <div className="absolute top-0 right-1 text-[8px] text-slate-400">100%</div>
               <div className="absolute bottom-0 right-1 text-[8px] text-slate-400">0%</div>
               <div className="absolute top-0 left-1 text-[9px] font-bold text-indigo-500/50 tracking-wider">GRADE TREND</div>
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="bg-white/70 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 backdrop-blur-sm shadow-xl dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <History className="mr-3 text-orange-500" />
                    Attempt History
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Track your grades and performance
                </p>
            </div>

            <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Sort by:</span>
                <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700">
                    <button 
                        onClick={() => setSortOption('Year')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${sortOption === 'Year' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Year
                    </button>
                    <button 
                        onClick={() => setSortOption('Correctness')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${sortOption === 'Correctness' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Grade
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-4 pb-10">
        {attempts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                <Clock size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">No history yet</p>
                <p className="text-sm">Attempt papers in the Dashboard to see them here.</p>
            </div>
        ) : (
            subjectKeys.map(subject => (
                <div key={subject} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                    <button 
                        onClick={() => toggleSubject(subject)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{subject}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">
                                {groupedAttempts[subject].length}
                            </span>
                        </div>
                        {expandedSubjects[subject] === false ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                    
                    {(expandedSubjects[subject] !== false) && (
                        <div className="p-4 pt-0">
                            {/* Visual Chart */}
                            {renderProgressChart(groupedAttempts[subject])}

                            <div className="divide-y divide-gray-100 dark:divide-slate-800">
                                {groupedAttempts[subject].map(attempt => {
                                    const { grade, colorClass, percent } = getGradeInfo(attempt);
                                    return (
                                        <div key={attempt.id} className={`py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 pl-4 ${grade === 'A' ? 'border-l-green-500' : (grade === 'B' || grade === 'C') ? 'border-l-yellow-500' : 'border-l-red-500'}`}>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-slate-900 dark:text-white text-lg">
                                                        {attempt.year} {attempt.session}
                                                    </span>
                                                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700">
                                                        Var {attempt.variant}
                                                    </span>
                                                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700">
                                                        Paper {attempt.paperNumber}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-slate-400 gap-3 mt-2">
                                                    <span title={new Date(attempt.timestamp).toLocaleString()}>
                                                        Recorded: {new Date(attempt.timestamp).toLocaleDateString()}
                                                    </span>
                                                    
                                                    <span className={`px-2 py-0.5 rounded-md font-bold border flex items-center gap-1 ${colorClass}`}>
                                                        <Trophy size={12} />
                                                        Grade {grade}
                                                    </span>

                                                    {attempt.isExam && (
                                                        <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded border border-orange-100 dark:border-orange-800/30">
                                                            <Timer size={12} />
                                                            Exam Mode
                                                        </span>
                                                    )}

                                                    {attempt.timeTaken !== undefined && (
                                                         <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                            <Clock size={12} />
                                                            {formatTime(attempt.timeTaken)}
                                                         </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-center hidden sm:block">
                                                    <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">A Threshold</span>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                                            {Math.round((attempt.aGradeThreshold / attempt.totalMarks) * 100)}%
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            ({attempt.aGradeThreshold})
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-center pl-6 border-l border-gray-200 dark:border-slate-700 min-w-[100px]">
                                                    <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Score</span>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none flex items-start">
                                                            {percent}<span className="text-sm pt-1">%</span>
                                                        </span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                            {attempt.userMarks} / {attempt.totalMarks}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
};