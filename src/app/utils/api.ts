import { LeetCodeProblem, RecentSubmission } from '../types';
import { parse } from 'csv-parse/sync';

// Store the tracking start time when the app first loads
const TRACKING_START_TIME = new Date().getTime();

// Function to get CSRF token from cookies - keeping for potential future use
// function getCSRFToken(): string {
//   const cookies = document.cookie.split(';');
//   const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
//   return csrfCookie ? csrfCookie.split('=')[1] : '';
// }

export async function fetchProblems(): Promise<LeetCodeProblem[]> {
  try {
    const response = await fetch('/150list.csv');
    const csvText = await response.text();
    
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });

    return records.map((record: Record<string, string>) => ({
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

export async function fetchRecentSubmissions(): Promise<RecentSubmission[]> {
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

    const submissions = data.data.recentAcSubmissionList
      .map((sub: Record<string, string | number>) => ({
        title: sub.title,
        link: `https://leetcode.com/problems/${sub.titleSlug}/`,
        timestamp: new Date(parseInt(String(sub.timestamp)) * 1000),
      }))
      .filter((sub: RecentSubmission) => sub.timestamp.getTime() >= TRACKING_START_TIME);

    return submissions;
  } catch (error) {
    console.error('Error fetching recent submissions:', error);
    return [];
  }
}

// Function to store submission data in sessionStorage
export function storeSubmissions(submissions: RecentSubmission[]): void {
  const existingSubmissions = loadStoredSubmissions();
  const allSubmissions = [...existingSubmissions, ...submissions];
  sessionStorage.setItem('leetcode_submissions', JSON.stringify(allSubmissions));
}

// Function to load stored submissions
export function loadStoredSubmissions(): RecentSubmission[] {
  const stored = sessionStorage.getItem('leetcode_submissions');
  return stored ? JSON.parse(stored) : [];
} 