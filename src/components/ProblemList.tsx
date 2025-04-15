import { useState } from 'react';
import { LeetCodeProblem } from '../types';

interface ProblemListProps {
  problems: LeetCodeProblem[];
}

type SortOption = 'default-asc' | 'default-desc' | 'type' | 'difficulty' | 'solved-asc' | 'solved-desc';
type Difficulty = 'Easy' | 'Medium' | 'Hard';

export default function ProblemList({ problems }: ProblemListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('default-asc');

  const sortedProblems = [...problems].sort((a, b) => {
    switch (sortBy) {
      case 'default-asc':
        return a.solvedCount - b.solvedCount || a.name.localeCompare(b.name);
      case 'default-desc':
        return b.solvedCount - a.solvedCount || a.name.localeCompare(b.name);
      case 'type':
        return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      case 'difficulty':
        const difficultyOrder: Record<Difficulty, number> = { 'Easy': 0, 'Medium': 1, 'Hard': 2 };
        return difficultyOrder[a.difficulty as Difficulty] - difficultyOrder[b.difficulty as Difficulty] || a.name.localeCompare(b.name);
      case 'solved-asc':
        return a.solvedCount - b.solvedCount;
      case 'solved-desc':
        return b.solvedCount - a.solvedCount;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-200">Problems</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm text-gray-300">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-700 text-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default-asc">Default (Solved ↑)</option>
            <option value="default-desc">Default (Solved ↓)</option>
            <option value="type">Type</option>
            <option value="difficulty">Difficulty</option>
            <option value="solved-asc">Times Solved ↑</option>
            <option value="solved-desc">Times Solved ↓</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg shadow-xl overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Problem
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Solved
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Last Solved
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-700">
              {sortedProblems.map((problem) => (
                <tr key={problem.link} className="hover:bg-slate-800 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-150"
                    >
                      {problem.name}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-sm rounded-full bg-slate-700 text-gray-300 font-medium">
                      {problem.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        problem.difficulty === 'Easy'
                          ? 'bg-green-900/50 text-green-300'
                          : problem.difficulty === 'Medium'
                          ? 'bg-yellow-900/50 text-yellow-300'
                          : 'bg-red-900/50 text-red-300'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-900/50 text-blue-300 font-medium">
                      {problem.solvedCount} {problem.solvedCount === 1 ? 'time' : 'times'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {problem.lastSolved
                      ? new Date(parseInt(problem.lastSolved) * 1000).toLocaleDateString()
                      : <span className="text-gray-500">Never</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 