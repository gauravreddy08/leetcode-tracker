import { useState } from 'react';
import { LeetCodeProblem } from '../types';

interface ProblemListProps {
  problems: LeetCodeProblem[];
}

type SortOption = 'last-solved' | 'category' | 'difficulty' | 'solved-asc' | 'solved-desc';

export default function ProblemList({ problems }: ProblemListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('last-solved');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(problems.map(p => p.category))).sort();

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          problem.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? problem.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    switch (sortBy) {
      case 'category':
        return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      case 'difficulty':
        const difficultyOrder = { 'Easy': 0, 'Medium': 1, 'Hard': 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] || a.name.localeCompare(b.name);
      case 'solved-asc':
        return a.solvedCount - b.solvedCount;
      case 'solved-desc':
        return b.solvedCount - a.solvedCount;
      case 'last-solved':
        if (!a.lastSolved && !b.lastSolved) return 0;
        if (!a.lastSolved) return 1;
        if (!b.lastSolved) return -1;
        return new Date(b.lastSolved).getTime() - new Date(a.lastSolved).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Problems
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">{filteredProblems.length}</span>
            </h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="block w-48 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            >
              <option value="last-solved">Sort by Last Solved</option>
              <option value="category">Sort by Category</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="solved-asc">Sort by Solved (Low to High)</option>
              <option value="solved-desc">Sort by Solved (High to Low)</option>
            </select>
          </div>
          <div className="relative rounded-md shadow-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 border rounded-md bg-white text-gray-900"
            />
          </div>
        </div>
      </div>
      
      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeCategory === null 
              ? 'bg-gray-700 text-white font-medium' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category === activeCategory ? null : category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                category === activeCategory 
                ? 'bg-gray-700 text-white font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="p-6">
        {sortedProblems.length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-gray-500">No problems match your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedProblems.map((problem) => (
              <div
                key={problem.name}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-150 border border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-gray-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-gray-900 font-medium transition-colors duration-150 text-lg"
                    >
                      {problem.name}
                    </a>
                    {problem.solvedCount > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="mr-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Solved
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      {problem.category}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        problem.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-800'
                          : problem.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-6 items-end md:items-center text-sm text-gray-500 w-full sm:w-auto">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500 text-xs uppercase">Solved:</span>
                    <span className="font-medium text-gray-700">{problem.solvedCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500 text-xs uppercase">Last solved:</span>
                    <span className="font-medium text-gray-700">
                      {problem.lastSolved
                        ? new Date(problem.lastSolved).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 