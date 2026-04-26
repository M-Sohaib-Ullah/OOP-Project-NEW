export enum AppMode {
  PAPERS = 'PAPERS',
  TUTOR = 'TUTOR',
  HISTORY = 'HISTORY',
  EXAM = 'EXAM',
  FOCUS = 'FOCUS',
  PLANNER = 'PLANNER',
  ANALYTICS = 'ANALYTICS',
  FLASHCARDS = 'FLASHCARDS',
  LEADERBOARD = 'LEADERBOARD'
}

export type DifficultyLevel = 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Very Hard';

export interface Subject {
  id: string;
  name: string;
  slug: string; // URL-friendly name for the repository
  code: string;
  level: 'O Level' | 'A Level';
}

export interface PastPaper {
  id: string;
  subjectId: string;
  year: number;
  session: 'May/June' | 'Oct/Nov';
  variant: number; // e.g., 12, 22, 41
  paperNumber: number; // e.g., 1, 2, 4
  totalMarks: number;
  aGradeThreshold: number;
  difficulty: DifficultyLevel;
  downloadUrl: string;
  markSchemeUrl: string;
}

export interface PaperAttempt {
  id: string; // Unique ID for the attempt
  paperId: string;
  subjectName: string;
  subjectCode: string;
  year: number;
  session: 'May/June' | 'Oct/Nov';
  variant: number;
  paperNumber: number;
  userMarks: number;
  totalMarks: number;
  aGradeThreshold: number;
  timestamp: number;
  isExam?: boolean;
  timeTaken?: number; // Duration in seconds
  struggledTopics?: string[]; // New: List of topics user found hard
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string; // Base64 data url
  timestamp: number;
  isLoading?: boolean;
}

// --- Gamification Types ---
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  unlocked: boolean;
  unlockedAt?: number;
}

export interface UserStats {
  streak: number;
  lastStudyDate: string; // ISO Date string
  totalMinutesStudied: number;
  papersCompleted: number;
  xp: number;
}

// --- Planner Types ---
export interface StudyTask {
  id: string;
  day: number; // Day number relative to start (1, 2, 3...)
  title: string;
  isCompleted: boolean;
}

export interface StudyPlan {
  id: string;
  subjectName: string;
  goal: string;
  startDate: number; // Timestamp
  targetDate: number; // Timestamp
  tasks: StudyTask[];
}

// --- Flashcard Types ---
export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subjectName: string;
  cards: Flashcard[];
  createdAt: number;
}

// --- Flashcard Types ---
export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subjectName: string;
  cards: Flashcard[];
  createdAt: number;
}