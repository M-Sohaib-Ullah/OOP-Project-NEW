import React, { useState, useMemo, useEffect } from 'react';
import { SUBJECTS, generateMockPapers } from '../services/mockData';
import { PastPaper, PaperAttempt, DifficultyLevel } from '../types';
import { PaperCard } from './PaperCard';
import { ExamInterface } from './ExamInterface';
import { Timer, Search } from 'lucide-react';

interface ExamDashboardProps {
    onSaveAttempt: (attempt: PaperAttempt) => void;
    existingAttempts: PaperAttempt[];
}

export const ExamDashboard: React.FC<ExamDashboardProps> = ({ onSaveAttempt, existingAttempts }) => {
    const [activeExamPaper, setActiveExamPaper] = useState<PastPaper | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>(SUBJECTS[0].id);
    const [papers, setPapers] = useState<PastPaper[]>([]);
    const [searchYear, setSearchYear] = useState<string>('2024');
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'All'>('All');

    // Load papers when subject changes
    useEffect(() => {
        const loadedPapers = generateMockPapers(selectedSubjectId);
        setPapers(loadedPapers);
    }, [selectedSubjectId]);

    // Simple Filter for Exam Dashboard
    const filteredPapers = useMemo(() => {
        return papers.filter(p => {
             // Basic year filter if valid year provided
             const y = parseInt(searchYear);
             const matchYear = !isNaN(y) ? p.year === y : true;

             // Difficulty filter
             const matchDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
             
             return matchYear && matchDifficulty;
        }).sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            return a.session.localeCompare(b.session);
        });
    }, [papers, searchYear, difficultyFilter]);

    const currentSubject = SUBJECTS.find(s => s.id === selectedSubjectId);

    const handleStartExam = (paper: PastPaper) => {
        setActiveExamPaper(paper);
    };

    const handleExamComplete = (attempt: PaperAttempt) => {
        onSaveAttempt(attempt);
        // We do not immediately close the exam interface, it shows the result screen
    };

    const handleExitExam = () => {
        setActiveExamPaper(null);
    };

    if (activeExamPaper && currentSubject) {
        return (
            <ExamInterface 
                paper={activeExamPaper}
                subjectName={currentSubject.name}
                subjectCode={currentSubject.code}
                onExit={handleExitExam}
                onComplete={handleExamComplete}
            />
        );
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="bg-orange-50 dark:bg-slate-900/50 border border-orange-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                            <Timer className="mr-3 text-orange-600" />
                            Exam Simulator
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Strict timing, hidden marks. Test yourself under exam conditions.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <select 
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            {SUBJECTS.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                            ))}
                        </select>

                        <select 
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value as any)}
                            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Very Easy">Very Easy</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                            <option value="Very Hard">Very Hard</option>
                        </select>

                        <input 
                            type="number"
                            placeholder="Year"
                            value={searchYear}
                            onChange={(e) => setSearchYear(e.target.value)}
                            className="w-24 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-4 custom-scrollbar">
                {filteredPapers.map((paper) => (
                    <PaperCard 
                        key={paper.id} 
                        paper={paper} 
                        subjectCode={currentSubject?.code || ''}
                        subjectName={currentSubject?.name}
                        previousAttempt={existingAttempts.find(a => a.paperId === paper.id)}
                        isExamMode={true}
                        onStartExam={handleStartExam}
                    />
                ))}
                {filteredPapers.length === 0 && (
                     <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-500">
                        <div className="bg-gray-100 dark:bg-slate-800/50 p-6 rounded-full mb-4">
                            <Search size={48} className="opacity-50" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No papers found</h3>
                        <p className="text-sm opacity-70 text-center max-w-md">
                            Try adjusting your search criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};