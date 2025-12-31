import { useState } from 'react';
import { dummyLeaderboardData, leaderboardCategories, months as monthNames, quarters as quarterNames } from '../lib/dummyData';

const Trophy = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
    <path d="M13 11V7h-2v4H8l4 4 4-4h-3z" />
  </svg>
);
const trophyColors = ['text-yellow-400', 'text-gray-400', 'text-yellow-600'];


export default function Leaderboard({ filters }) {
  const { year: selectedYear, month: selectedMonth, quarter: selectedQuarter } = filters;
  const [selectedCategory, setSelectedCategory] = useState(leaderboardCategories[0]);


  const getFilteredAndSortedLeaderboard = () => {
    let currentLeaderboardData = [...dummyLeaderboardData];

    // Apply Year filter
    currentLeaderboardData = currentLeaderboardData.filter(item => item.year === selectedYear);

    // Apply Quarter filter
    if (selectedQuarter !== 0) {
      const quarterString = `Q${selectedQuarter}`;
      currentLeaderboardData = currentLeaderboardData.filter(item => item.quarter === quarterString);
    }

    // Apply Month filter
    if (selectedMonth !== 0) {
      const monthString = monthNames[selectedMonth - 1];
      currentLeaderboardData = currentLeaderboardData.filter(item => item.month === monthString);
    }

    // Apply LGA filter from props
    if (filters.selectedLgas && !filters.selectedLgas.includes('All')) { // Check if selectedLgas exists before using
      currentLeaderboardData = currentLeaderboardData.filter(item => filters.selectedLgas.includes(item.lga));
    }

    // Calculate score based on selectedCategory and sort
    const leaderboardWithScores = currentLeaderboardData.map(item => {
      const score = item.categories[selectedCategory] ? item.categories[selectedCategory].total : 0;
      return { ...item, score };
    });

    leaderboardWithScores.sort((a, b) => b.score - a.score);

    // Assign positions dynamically
    const finalLeaderboard = leaderboardWithScores.map((item, index) => ({
      ...item,
      position: index + 1
    }));

    return finalLeaderboard;
  };

  const displayLeaderboard = getFilteredAndSortedLeaderboard();

  // Calculate total LGA reporting
  const totalReporting = displayLeaderboard.reduce((sum, item) => sum + item.reporting, 0);

  return (
    <section className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
        <div className="relative">
          <select
            className="px-4 py-2 border rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 min-w-[180px] font-semibold shadow"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {leaderboardCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex space-x-8 justify-center items-end mb-6">
        {displayLeaderboard.length > 0 ? (
          displayLeaderboard.slice(0, 3).map((item, idx) => ( // Display top 3 again
            <div
              key={item.lga}
              className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-white rounded-2xl px-8 py-6 shadow-lg border border-blue-100 hover:scale-105 transition-transform duration-200"
            >
              {item.position <= 3 && <Trophy className={`mb-2 w-10 h-10 ${trophyColors[item.position - 1]}`} />}
              <span className="font-bold text-xl text-gray-800 mb-1">{item.lga}</span>
              <div className="flex flex-row items-center gap-4 mb-1">
                <span className="text-xs text-gray-400">Position {item.position}</span>
              </div>
              <span className="text-3xl font-extrabold text-blue-700 mb-1">{item.score}</span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10 w-full">No data available for the selected filters.</div>
        )}
        <div className="flex flex-col items-center bg-blue-50 rounded-2xl px-8 py-6 shadow-lg border border-blue-200 ml-8">
          <span className="font-bold text-lg text-blue-800 mb-2">LGA Reporting</span>
          <span className="text-3xl font-extrabold text-blue-900">{totalReporting}</span>
        </div>
      </div>

    </section>
  );
}