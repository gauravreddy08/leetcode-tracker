'use client';

import { useState, useEffect } from 'react';
import { LeetCodeProblem, RecentSubmission } from './types';
import ProblemList from './components/ProblemList';
import { fetchRecentSubmissions, fetchProblems, storeSubmissions, loadStoredSubmissions } from './utils/api';

const REFRESH_INTERVAL = 30000; // Refresh every 30 seconds

const tabs = ['All', 'Easy', 'Medium', 'Hard'];

export default function Home() {
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');

  // Load problems and initial submissions
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [problemsData, storedSubmissions] = await Promise.all([
          fetchProblems(),
          loadStoredSubmissions(),
        ]);
        setProblems(problemsData);
        setRecentSubmissions(storedSubmissions);
        console.log('Initial data loaded:', { problems: problemsData.length, submissions: storedSubmissions.length });
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Set up periodic submission updates
  useEffect(() => {
    async function updateSubmissions() {
      try {
        setIsLoading(true);
        console.log('Fetching new submissions...');
        const submissions = await fetchRecentSubmissions();
        console.log('New submissions fetched:', submissions.length);
        setRecentSubmissions(submissions);
        storeSubmissions(submissions);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error updating submissions:', error);
        setError('Failed to update data');
      } finally {
        setIsLoading(false);
      }
    }

    // Update immediately and then set up interval
    console.log('Setting up auto-refresh interval...');
    updateSubmissions();
    const interval = setInterval(updateSubmissions, REFRESH_INTERVAL);

    return () => {
      console.log('Cleaning up auto-refresh interval...');
      clearInterval(interval);
    };
  }, []);

  // Update problem stats when new submissions come in
  useEffect(() => {
    if (recentSubmissions.length === 0) return;

    const updatedProblems = problems.map(problem => {
      const submissions = recentSubmissions.filter(
        sub => sub.link === problem.link
      );
      return {
        ...problem,
        solvedCount: submissions.length,
        lastSolved: submissions.length > 0 ? submissions[0].timestamp : null,
      };
    });

    setProblems(updatedProblems);
  }, [recentSubmissions, problems]);
  
  // Filter problems based on active tab
  const filteredProblems = problems.filter(problem => {
    if (activeTab === 'All') return true;
    return problem.difficulty === activeTab;
  });

  // Calculate stats for the different difficulty levels
  const stats = {
    easy: problems.filter(p => p.difficulty === 'Easy' && p.solvedCount > 0).length,
    medium: problems.filter(p => p.difficulty === 'Medium' && p.solvedCount > 0).length,
    hard: problems.filter(p => p.difficulty === 'Hard' && p.solvedCount > 0).length,
    solved: problems.filter(p => p.solvedCount > 0).length
  };

  return (
    <main className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="gradient-header text-white py-10 px-6 shadow-lg relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                  </svg>
                  LeetCode Tracker
                </h1>
                <p className="text-white/70 mt-1 text-sm">Tracking progress for <span className="text-white font-medium">@gaurxvreddy</span></p>
                <div className="mt-2 flex items-center">
                  <span className="text-white/70 text-xs">
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Updating...</span>
                      </div>
                    ) : lastUpdated ? (
                      <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                    ) : null}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-green-50/30 backdrop-blur-sm rounded-lg px-4 py-2 flex flex-col items-center border border-green-100/30">
                  <span className="text-xl font-semibold text-white">{stats.easy}</span>
                  <span className="text-xs text-white/70 font-medium">EASY</span>
                </div>
                <div className="bg-yellow-50/30 backdrop-blur-sm rounded-lg px-4 py-2 flex flex-col items-center border border-yellow-100/30">
                  <span className="text-xl font-semibold text-white">{stats.medium}</span>
                  <span className="text-xs text-white/70 font-medium">MEDIUM</span>
                </div>
                <div className="bg-red-50/30 backdrop-blur-sm rounded-lg px-4 py-2 flex flex-col items-center border border-red-100/30">
                  <span className="text-xl font-semibold text-white">{stats.hard}</span>
                  <span className="text-xs text-white/70 font-medium">HARD</span>
                </div>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="flex space-x-1 mt-6 bg-white/10 backdrop-blur-sm p-1 rounded-lg w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading && problems.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            <ProblemList problems={filteredProblems} />
          </div>
        )}
      </div>
    </main>
  );
}
