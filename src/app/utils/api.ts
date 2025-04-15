import { LeetCodeProblem, RecentSubmission } from '../types';
import { parse } from 'csv-parse/sync';
import { LEETCODE_CONFIG } from '../config';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

// Function to get CSRF token from cookies
function getCSRFToken(): string {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
  return csrfCookie ? csrfCookie.split('=')[1] : '';
}

export async function fetchProblems(): Promise<LeetCodeProblem[]> {
  try {
    const response = await fetch('/150list.csv');
    const csvText = await response.text();
    
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });

    return records.map((record: any) => ({
      name: record.Name,
      category: record.Category,
      difficulty: record.Difficulty,
      link: record.Link,
      solvedCount: 0,
      lastSolved: null,
    }));
  } catch (error) {
    console.error('Error reading problems:', error);
    return [];
  }
}

export async function fetchRecentSubmissions(username: string = LEETCODE_CONFIG.username, limit: number = 25): Promise<RecentSubmission[]> {
  try {
    const response = await fetch('/api/submissions');
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Response Error:', errorData);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response Data:', data);

    if (!data.data?.recentAcSubmissionList) {
      console.error('Unexpected API response structure:', data);
      return [];
    }

    const lastCleared = sessionStorage.getItem('leetcode_last_cleared');
    const clearedTime = lastCleared ? new Date(lastCleared).getTime() : 0;

    const submissions = data.data.recentAcSubmissionList
      .map((sub: any) => ({
        title: sub.title,
        link: `https://leetcode.com/problems/${sub.titleSlug}/`,
        timestamp: new Date(parseInt(sub.timestamp) * 1000),
      }))
      .filter((sub: RecentSubmission) => sub.timestamp.getTime() > clearedTime);

    return submissions;
  } catch (error) {
    console.error('Error fetching recent submissions:', error);
    return [];
  }
}

// Function to store submission data in sessionStorage
export function storeSubmissions(submissions: RecentSubmission[]): void {
  sessionStorage.setItem('leetcode_submissions', JSON.stringify(submissions));
}

// Function to load stored submissions
export function loadStoredSubmissions(): RecentSubmission[] {
  const stored = sessionStorage.getItem('leetcode_submissions');
  return stored ? JSON.parse(stored) : [];
}

export function clearStoredSubmissions() {
  sessionStorage.setItem('leetcode_last_cleared', new Date().toISOString());
  sessionStorage.removeItem('leetcode_submissions');
} 