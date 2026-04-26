import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Star, Flame, Loader2 } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { UserStats } from '../types';

interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  score: number;
  streak: number;
  papersCompleted: number;
}

export const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        
        const fetchedLeaders: LeaderboardEntry[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as UserStats;
          // Note: In a real app, you'd want to fetch user profiles separately or denormalize
          // displayName and photoURL into the userStats document for efficiency.
          // For this prototype, we'll assume they might be there or use fallbacks.
          fetchedLeaders.push({
            uid: data.uid || doc.id,
            displayName: (data as any).displayName || 'Anonymous Scholar',
            photoURL: (data as any).photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
            score: data.xp || 0,
            streak: data.streak || 0,
            papersCompleted: data.papersCompleted || 0
          });
        });
        
        setLeaders(fetchedLeaders);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-slate-500">Loading top scholars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-12">
        <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full">
          <Trophy size={48} className="text-amber-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Global Leaderboard</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Compete with students worldwide. Earn points by completing past papers and maintaining your study streak.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div className="col-span-2 md:col-span-1 text-center">Rank</div>
          <div className="col-span-6 md:col-span-5">Student</div>
          <div className="col-span-4 md:col-span-2 text-right">Score</div>
          <div className="hidden md:block col-span-2 text-center">Streak</div>
          <div className="hidden md:block col-span-2 text-center">Papers</div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {leaders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No data available yet. Be the first to climb the ranks!
            </div>
          ) : (
            leaders.map((leader, index) => (
              <div 
                key={leader.uid} 
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  index < 3 ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''
                }`}
              >
                <div className="col-span-2 md:col-span-1 flex justify-center">
                  {index === 0 ? <Crown className="text-amber-500" size={24} /> :
                   index === 1 ? <Medal className="text-slate-400" size={24} /> :
                   index === 2 ? <Medal className="text-amber-700" size={24} /> :
                   <span className="font-bold text-slate-400">{index + 1}</span>}
                </div>
                
                <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                  <img 
                    src={leader.photoURL} 
                    alt={leader.displayName} 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                  />
                  <span className="font-medium text-slate-900 dark:text-white truncate">
                    {leader.displayName}
                  </span>
                </div>
                
                <div className="col-span-4 md:col-span-2 text-right flex items-center justify-end gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                  <Star size={16} className="fill-indigo-600 dark:fill-indigo-400" />
                  {leader.score.toLocaleString()}
                </div>
                
                <div className="hidden md:flex col-span-2 justify-center items-center gap-1 text-orange-500 font-medium">
                  <Flame size={16} className={leader.streak > 3 ? 'fill-orange-500' : ''} />
                  {leader.streak}
                </div>
                
                <div className="hidden md:block col-span-2 text-center text-slate-500 dark:text-slate-400 font-medium">
                  {leader.papersCompleted}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
