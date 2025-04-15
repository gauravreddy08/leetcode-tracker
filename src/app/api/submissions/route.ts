import { NextResponse } from 'next/server';
import { LEETCODE_CONFIG } from '../../config';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

export async function GET() {
  try {
    const query = `query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }`;

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://leetcode.com',
      'Referer': 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'X-CSRFToken': LEETCODE_CONFIG.csrfToken,
      'Cookie': `csrftoken=${LEETCODE_CONFIG.csrfToken}; LEETCODE_SESSION=${LEETCODE_CONFIG.sessionId}`,
    };

    const response = await fetch(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: { 
          username: LEETCODE_CONFIG.username,
          limit: 25 
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LeetCode API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request to LeetCode:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 