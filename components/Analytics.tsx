import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { PaperAttempt, UserStats } from '../types';

interface AnalyticsProps {
  attempts: PaperAttempt[];
  userStats: UserStats;
}

export const Analytics: React.FC<AnalyticsProps> = ({ attempts, userStats }) => {
  // Process data for Line Chart (Scores over time)
  const scoreData = attempts
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(attempt => ({
      date: new Date(attempt.timestamp).toLocaleDateString(),
      score: Math.round((attempt.userMarks / attempt.totalMarks) * 100),
      subject: attempt.subjectName
    }));

  // Process data for Radar Chart (Subject performance)
  const subjectPerformance: Record<string, { totalScore: number; count: number }> = {};
  attempts.forEach(attempt => {
    if (!subjectPerformance[attempt.subjectName]) {
      subjectPerformance[attempt.subjectName] = { totalScore: 0, count: 0 };
    }
    subjectPerformance[attempt.subjectName].totalScore += (attempt.userMarks / attempt.totalMarks) * 100;
    subjectPerformance[attempt.subjectName].count += 1;
  });

  const radarData = Object.keys(subjectPerformance).map(subject => ({
    subject,
    averageScore: Math.round(subjectPerformance[subject].totalScore / subjectPerformance[subject].count)
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Progress Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Papers</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{userStats.papersCompleted}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Study Streak</h3>
          <p className="text-3xl font-bold text-orange-500">{userStats.streak} Days</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Average Score</h3>
          <p className="text-3xl font-bold text-emerald-500">
            {attempts.length > 0 
              ? Math.round(attempts.reduce((acc, curr) => acc + (curr.userMarks / curr.totalMarks) * 100, 0) / attempts.length)
              : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Score Trends</h3>
          {scoreData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} name="Score (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              Complete some papers to see your trends!
            </div>
          )}
        </div>

        {/* Radar Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Subject Strengths</h3>
          {radarData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#334155" opacity={0.2} />
                  <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={12} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" opacity={0.5} />
                  <Radar name="Average Score" dataKey="averageScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              Complete papers across different subjects to see your strengths!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
