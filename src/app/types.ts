export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface LeetCodeProblem {
  name: string;
  category: string;
  difficulty: Difficulty;
  link: string;
  solvedCount: number;
  lastSolved: Date | null;
}

export interface RecentSubmission {
  title: string;
  link: string;
  timestamp: Date;
} 