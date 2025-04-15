export interface LeetCodeProblem {
  category: string;
  name: string;
  difficulty: string;
  link: string;
  solvedCount: number;
  lastSolved?: string;
}

export interface RecentSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
}

export interface GraphQLResponse {
  data: {
    recentAcSubmissionList: RecentSubmission[];
  };
} 