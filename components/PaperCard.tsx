import React, { useState } from 'react';
import { PastPaper, PaperAttempt } from '../types';
import { Download, FileText, CheckCircle, Save, XCircle, Timer, Star } from 'lucide-react';

interface PaperCardProps {
  paper: PastPaper;
  subjectCode: string;
  subjectName?: string;
  onSaveAttempt?: (attempt: PaperAttempt) => void;
  previousAttempt?: PaperAttempt;
  isExamMode?: boolean;
  onStartExam?: (paper: PastPaper) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (paperId: string) => void;
}

const getDifficultyColor = (diff: string) => {
    switch(diff) {
        case 'Very Easy': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/50';
        case 'Easy': return 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/50';
        case 'Medium': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/50';
        case 'Hard': return 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/50';
        case 'Very Hard': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/50';
        default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
};

export const PaperCard: React.FC<PaperCardProps> = ({ 
    paper, 
    subjectCode, 
    subjectName, 
    onSaveAttempt, 
    previousAttempt, 
    isExamMode = false,
    onStartExam,
    isBookmarked,
    onToggleBookmark
}) => {
  const [showScoreInput, setShowScoreInput] = useState(false);
  const [userMarks, setUserMarks] = useState<string>(previousAttempt ? previousAttempt.userMarks.toString() : '');
  const percentage = Math.round((paper.aGradeThreshold / paper.totalMarks) * 100);

  const handleSave = () => {
    if (!userMarks || isNaN(parseInt(userMarks)) || !onSaveAttempt) return;
    
    const marks = parseInt(userMarks);
    if (marks < 0 || marks > paper.totalMarks) {
        alert(`Marks must be between 0 and ${paper.totalMarks}`);
        return;
    }

    const attempt: PaperAttempt = {
        id: Date.now().toString(),
        paperId: paper.id,
        subjectName: subjectName || 'Unknown',
        subjectCode: subjectCode,
        year: paper.year,
        session: paper.session,
        variant: paper.variant,
        paperNumber: paper.paperNumber,
        userMarks: marks,
        totalMarks: paper.totalMarks,
        aGradeThreshold: paper.aGradeThreshold,
        timestamp: Date.now()
    };
    
    onSaveAttempt(attempt);
    setShowScoreInput(false);
  };

  return (
    <div className={`bg-white dark:bg-slate-800/50 border ${previousAttempt ? 'border-indigo-300 dark:border-indigo-500/50' : 'border-gray-200 dark:border-slate-700'} rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group flex flex-col h-full shadow-sm hover:shadow-xl dark:shadow-lg dark:hover:border-slate-600 relative overflow-hidden`}>
      {previousAttempt && (
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
              ATTEMPTED
          </div>
      )}
      
      {!isExamMode && onToggleBookmark && (
          <button 
            onClick={(e) => {
                e.preventDefault();
                onToggleBookmark(paper.id);
            }}
            className="absolute top-0 right-0 p-2 text-slate-300 hover:text-yellow-400 transition-colors z-10"
            title="Bookmark Paper"
          >
              <Star size={18} className={isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''} />
          </button>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div className="pr-6">
            <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {paper.session === 'May/June' ? 'MJ' : 'ON'} {paper.year}
                </h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-800">
                    {subjectCode}/{paper.variant}
                </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Paper {paper.paperNumber}</p>
        </div>
        {!isExamMode && (
            <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(paper.difficulty)}`}>
                {paper.difficulty}
            </div>
        )}
      </div>

      {!isExamMode && (
        <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 mb-4 flex justify-between items-center text-sm border border-gray-100 dark:border-slate-800/50">
            <span className="text-slate-600 dark:text-slate-400">A Grade Threshold:</span>
            <div className="text-right">
                <span className="font-bold text-slate-900 dark:text-white block">{paper.aGradeThreshold} / {paper.totalMarks}</span>
                <span className="text-xs text-slate-500">({percentage}%)</span>
            </div>
        </div>
      )}

      {isExamMode && (
         <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mb-4 flex items-center gap-3 text-sm border border-orange-100 dark:border-orange-900/30">
             <Timer size={16} className="text-orange-600 dark:text-orange-400" />
             <span className="text-orange-800 dark:text-orange-300 font-medium">Exam Mode</span>
         </div>
      )}

      {/* Score Input Section (Disabled in Exam Mode selection screen) */}
      {!isExamMode && (
        showScoreInput ? (
            <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <div className="relative flex-1">
                    <input 
                        type="number" 
                        value={userMarks}
                        onChange={(e) => setUserMarks(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded px-3 py-1.5 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                        autoFocus
                        placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono">
                        / {paper.totalMarks}
                    </span>
                </div>
                <button 
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
                    title="Save Score"
                >
                    <Save size={16} />
                </button>
                <button 
                    onClick={() => setShowScoreInput(false)}
                    className="bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 p-2 rounded-lg transition-colors"
                    title="Cancel"
                >
                    <XCircle size={16} />
                </button>
            </div>
        ) : (
            <div className="mb-4">
                {previousAttempt ? (
                    <div className="flex items-center justify-between text-sm bg-indigo-50 dark:bg-indigo-900/10 px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                        <span className="text-indigo-900 dark:text-indigo-300 font-medium">Your Score:</span>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-indigo-700 dark:text-indigo-200">{previousAttempt.userMarks} / {paper.totalMarks}</span>
                            <button onClick={() => setShowScoreInput(true)} className="text-xs text-indigo-500 underline hover:text-indigo-700">Edit</button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setShowScoreInput(true)}
                        className="w-full py-2 border border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={14} />
                        Record Score
                    </button>
                )}
            </div>
        )
      )}

      <div className="mt-auto flex gap-2">
        {isExamMode ? (
            <button 
                onClick={() => onStartExam && onStartExam(paper)}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
            >
                <Timer size={16} />
                <span className="font-bold">Start Exam</span>
            </button>
        ) : (
            <>
                <a 
                    href={paper.downloadUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    download 
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-95" 
                    title="Download Question Paper"
                >
                    <Download size={16} />
                    <span className="font-medium">Paper</span>
                </a>
                <a 
                    href={paper.markSchemeUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    download
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-lg text-sm transition-all border border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500 active:scale-95" 
                    title="Download Mark Scheme"
                >
                    <FileText size={16} />
                    <span className="font-medium">Scheme</span>
                </a>
            </>
        )}
      </div>
    </div>
  );
};