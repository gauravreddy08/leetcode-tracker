import { GraphQLResponse, RecentSubmission } from '../types';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

export async function fetchRecentSubmissions(username: string, limit: number): Promise<RecentSubmission[]> {
  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

  const variables = {
    username,
    limit,
  };

  try {
    const response = await fetch(LEETCODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data: GraphQLResponse = await response.json();
    return data.data.recentAcSubmissionList;
  } catch (error) {
    console.error('Error fetching recent submissions:', error);
    return [];
  }
} 