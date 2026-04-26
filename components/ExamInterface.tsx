import React, { useState, useEffect, useMemo } from 'react';
import { PastPaper, PaperAttempt } from '../types';
import { getPaperDuration, getSubjectsTopics } from '../services/mockData';
import { generateExamFeedback, gradeAnswer } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Spinner } from './Spinner';
import { Timer, FileText, CheckCircle, AlertTriangle, ArrowLeft, Download, Award, BarChart, Clock, Sparkles, Tag, ChevronRight } from 'lucide-react';

interface ExamInterfaceProps {
    paper: PastPaper;
    subjectName: string;
    subjectCode: string;
    onExit: () => void;
    onComplete: (attempt: PaperAttempt) => void;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({ paper, subjectName, subjectCode, onExit, onComplete }) => {
    const totalDuration = useMemo(() => {
        const level = subjectCode.startsWith('9') ? 'A Level' : 'O Level';
        return getPaperDuration(paper.paperNumber, level) * 60; 
    }, [paper.paperNumber, subjectCode]);

    const availableTopics = useMemo(() => getSubjectsTopics(subjectCode), [subjectCode]);

    const [timeLeft, setTimeLeft] = useState<number>(totalDuration);
    const [isActive, setIsActive] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [userMarks, setUserMarks] = useState('');
    const [gradeResult, setGradeResult] = useState<{grade: string, percentage: number} | null>(null);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    
    // Topic Tagging State
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    
    // AI Feedback State
    const [aiFeedback, setAiFeedback] = useState<string>('');
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

    // Auto-Grading State
    const [isAutoGrading, setIsAutoGrading] = useState(false);
    const [studentAnswer, setStudentAnswer] = useState('');
    const [autoGradeFeedback, setAutoGradeFeedback] = useState('');
    const [showAutoGrade, setShowAutoGrade] = useState(false);
    const [questionText, setQuestionText] = useState('');

    useEffect(() => {
        let interval: number | undefined;
        if (isActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            finishExam();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev => 
            prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
        );
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m ${s}s`;
        return `${m}m ${s}s`;
    };

    const finishExam = () => {
        setIsActive(false);
        setIsFinished(true);
    };

    const calculateGrade = (marks: number, total: number, aThreshold: number) => {
        const percentage = (marks / total) * 100;
        const aPercent = (aThreshold / total) * 100;
        
        if (marks >= aThreshold) return 'A';
        if (percentage >= aPercent - 10) return 'B';
        if (percentage >= aPercent - 20) return 'C';
        if (percentage >= aPercent - 30) return 'D';
        if (percentage >= aPercent - 40) return 'E';
        return 'U';
    };

    const handleSubmitScore = async () => {
        const marks = parseInt(userMarks);
        if (isNaN(marks) || marks < 0 || marks > paper.totalMarks) {
            alert(`Please enter valid marks between 0 and ${paper.totalMarks}`);
            return;
        }

        const percentage = (marks / paper.totalMarks) * 100;
        const grade = calculateGrade(marks, paper.totalMarks, paper.aGradeThreshold);
        const timeTaken = totalDuration - timeLeft;

        const attempt: PaperAttempt = {
            id: Date.now().toString(),
            paperId: paper.id,
            subjectName: subjectName,
            subjectCode: subjectCode,
            year: paper.year,
            session: paper.session,
            variant: paper.variant,
            paperNumber: paper.paperNumber,
            userMarks: marks,
            totalMarks: paper.totalMarks,
            aGradeThreshold: paper.aGradeThreshold,
            timestamp: Date.now(),
            isExam: true,
            timeTaken: timeTaken,
            struggledTopics: selectedTopics
        };

        setGradeResult({ grade, percentage });
        onComplete(attempt);
        
        // Trigger AI Feedback
        setIsLoadingFeedback(true);
        try {
            const feedback = await generateExamFeedback(
                subjectName,
                subjectCode,
                paper.paperNumber,
                marks,
                paper.totalMarks,
                grade,
                paper.aGradeThreshold
            );
            setAiFeedback(feedback);
        } catch (error) {
            console.error(error);
            setAiFeedback("Unable to load AI feedback.");
        } finally {
            setIsLoadingFeedback(false);
        }
    };

    const handleExitRequest = () => {
        if (gradeResult) {
            onExit();
        } else {
            setShowExitConfirm(true);
        }
    };

    const handleAutoGrade = async () => {
        if (!questionText.trim() || !studentAnswer.trim()) {
            alert("Please enter both the question and your answer.");
            return;
        }
        setIsAutoGrading(true);
        setAutoGradeFeedback('');
        try {
            const result = await gradeAnswer(questionText, studentAnswer, paper.totalMarks);
            setAutoGradeFeedback(`**Score:** ${result.score}/${paper.totalMarks}\n\n**Feedback:**\n${result.feedback}`);
            setUserMarks(result.score.toString());
        } catch (error) {
            console.error(error);
            setAutoGradeFeedback("Failed to auto-grade. Please try again or enter marks manually.");
        } finally {
            setIsAutoGrading(false);
        }
    };

    if (gradeResult) {
        const timeTaken = totalDuration - timeLeft;
        
        return (
            <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-300 p-4 overflow-y-auto">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 max-w-2xl w-full text-center relative overflow-hidden my-auto">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
                    
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        {gradeResult.grade === 'A' ? (
                            <Award size={48} className="text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <CheckCircle size={48} className="text-emerald-600 dark:text-emerald-400" />
                        )}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Exam Completed</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        {subjectCode} - {paper.year} {paper.session} Paper {paper.paperNumber}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col items-center justify-center">
                             <span className="flex items-center justify-center gap-1 text-xs text-slate-500 uppercase font-semibold mb-1">
                                <Clock size={12} /> Time Taken
                            </span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {formatDuration(timeTaken)}
                            </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex flex-col items-center justify-center">
                            <span className="flex items-center justify-center gap-1 text-xs text-slate-500 uppercase font-semibold mb-1">
                                <BarChart size={12} /> Score
                            </span>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                {userMarks}<span className="text-sm text-slate-400">/{paper.totalMarks}</span>
                            </span>
                        </div>
                        <div className={`p-4 rounded-xl border ${gradeResult.grade === 'A' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-600'} flex flex-col items-center justify-center`}>
                            <span className="flex items-center justify-center gap-1 text-xs text-slate-500 uppercase font-semibold mb-1">
                                <Award size={12} /> Grade
                            </span>
                            <span className={`text-2xl font-extrabold ${gradeResult.grade === 'A' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                {gradeResult.grade}
                            </span>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6 text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                        <p>
                            You scored <strong>{Math.round(gradeResult.percentage)}%</strong>. 
                            The 'A' grade threshold was {paper.aGradeThreshold} ({Math.round((paper.aGradeThreshold / paper.totalMarks) * 100)}%).
                        </p>
                    </div>

                    {/* AI Feedback Section */}
                    <div className="mb-8 text-left bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-indigo-100 dark:border-slate-700 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">
                                AI Examiner Feedback
                            </h3>
                        </div>
                        
                        {isLoadingFeedback ? (
                            <div className="flex flex-col items-center justify-center py-6 space-y-3">
                                <Spinner />
                                <span className="text-xs text-slate-400">Analyzing your performance...</span>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-700 dark:text-slate-300">
                                {aiFeedback ? (
                                    <MarkdownRenderer content={aiFeedback} />
                                ) : (
                                    <p className="text-slate-400 italic">No feedback available.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={onExit}
                        className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-6 max-w-5xl mx-auto relative">
            {/* Header / Timer */}
            <div className={`bg-white dark:bg-slate-800 border-b-4 ${isActive ? 'border-orange-500' : 'border-slate-300 dark:border-slate-600'} p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition-colors`}>
                <div>
                    <div className="flex items-center gap-3">
                         <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                             {subjectName} <span className="text-slate-400 font-normal">({subjectCode})</span>
                         </h2>
                         <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs font-mono text-slate-600 dark:text-slate-300">
                             {paper.year} {paper.session} P{paper.paperNumber}
                         </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        {isActive ? 'Exam in progress. Good luck!' : 'Exam finished. Time to mark your work.'}
                    </p>
                </div>

                <div className={`flex items-center gap-3 px-6 py-3 rounded-lg font-mono text-3xl font-bold ${isActive ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'bg-gray-100 dark:bg-slate-700 text-slate-500'}`}>
                    <Timer size={32} className={isActive ? 'animate-pulse' : ''} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Question Paper Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-full">
                        <FileText size={48} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Question Paper</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                            Open the question paper in a new tab. Keep this tab open to track your time.
                        </p>
                    </div>
                    <a 
                        href={paper.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Download size={18} />
                        Open Paper
                    </a>
                </div>

                {/* Status / Marking Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 flex flex-col shadow-sm">
                    {!isFinished ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-50">
                             <div className="bg-gray-100 dark:bg-slate-700 p-6 rounded-full">
                                <AlertTriangle size={48} className="text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Mark Scheme Locked</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                    The marking scheme will be available once the timer ends or you finish the exam.
                                </p>
                            </div>
                            <button 
                                onClick={finishExam}
                                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                Finish Exam Early
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-4 mb-2">
                                <h3 className="font-bold text-green-800 dark:text-green-300 mb-1">Time's Up!</h3>
                                <p className="text-xs text-green-700 dark:text-green-400">Download the mark scheme and grade your work.</p>
                            </div>

                            <a 
                                href={paper.markSchemeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <FileText size={18} />
                                Download Mark Scheme
                            </a>
                            
                            {/* Topic Selection Tagging */}
                            <div className="w-full text-left space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Tag difficult topics (optional)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTopics.map(topic => (
                                        <button
                                            key={topic}
                                            onClick={() => toggleTopic(topic)}
                                            className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                                                selectedTopics.includes(topic)
                                                ? 'bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-900/40 dark:border-orange-700 dark:text-orange-200'
                                                : 'bg-gray-50 border-gray-200 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600'
                                            }`}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full pt-6 border-t border-gray-200 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left">
                                        {showAutoGrade ? 'AI Auto-Grading' : 'Enter your final score'}
                                    </label>
                                    <button
                                        onClick={() => setShowAutoGrade(!showAutoGrade)}
                                        className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                                    >
                                        {showAutoGrade ? 'Switch to Manual Entry' : 'Try AI Auto-Grading'}
                                    </button>
                                </div>

                                {showAutoGrade ? (
                                    <div className="space-y-4 text-left">
                                        <div>
                                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Question</label>
                                            <textarea
                                                value={questionText}
                                                onChange={(e) => setQuestionText(e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                placeholder="Paste the question here..."
                                                rows={2}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Your Answer</label>
                                            <textarea
                                                value={studentAnswer}
                                                onChange={(e) => setStudentAnswer(e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                placeholder="Paste your answer here..."
                                                rows={4}
                                            />
                                        </div>
                                        <button
                                            onClick={handleAutoGrade}
                                            disabled={isAutoGrading || !questionText.trim() || !studentAnswer.trim()}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isAutoGrading ? <Spinner size="sm" /> : <Sparkles size={16} />}
                                            {isAutoGrading ? 'Grading...' : 'Grade Answer'}
                                        </button>
                                        
                                        {autoGradeFeedback && (
                                            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30 text-sm">
                                                <MarkdownRenderer content={autoGradeFeedback} />
                                                <div className="mt-4 flex justify-end">
                                                    <button 
                                                        onClick={handleSubmitScore}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
                                                    >
                                                        Accept Score & Submit <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <input 
                                                type="number" 
                                                value={userMarks}
                                                onChange={(e) => setUserMarks(e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                placeholder="0"
                                                min="0"
                                                max={paper.totalMarks}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                                / {paper.totalMarks}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={handleSubmitScore}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                                        >
                                            Submit <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex justify-start">
                <button onClick={handleExitRequest} className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <ArrowLeft size={18} className="mr-2" />
                    Quit Exam
                </button>
            </div>

            {/* Confirmation Modal */}
            {showExitConfirm && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-gray-200 dark:border-slate-700 mx-4">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                                <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quit Exam?</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                    {isActive 
                                        ? "The timer is still running. Your progress will be lost." 
                                        : "You haven't submitted your score yet. Your attempt won't be saved."}
                                </p>
                            </div>
                            <div className="flex gap-3 w-full pt-2">
                                <button 
                                    onClick={() => setShowExitConfirm(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={onExit}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Quit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};