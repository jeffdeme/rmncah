'use client';
import Header from "../components/header";
import Leaderboard from "../components/Leaderboard";
import ServiceDeliveryChart from "../components/ServiceDeliveryChart";
import Scorecard from "../components/Scorecard";
import Sidebar from "../components/Sidebar";
import { useState } from 'react';
import { leaderboardCategories } from '../lib/dummyData';

export default function Home() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(12);
  const [quarter, setQuarter] = useState(0); // 0 for all quarters
  const [selectedLgas, setSelectedLgas] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState(leaderboardCategories[0]);

  const filters = { year, month, quarter, selectedLgas, category: selectedCategory };

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <Sidebar
        year={year} setYear={setYear}
        month={month} setMonth={setMonth}
        quarter={quarter} setQuarter={setQuarter}
        selectedLgas={selectedLgas} setSelectedLgas={setSelectedLgas}
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 space-y-8 bg-zinc-50">
          <div className="max-w-6xl mx-auto">
            <Leaderboard
              filters={filters}
            />
          </div>
          <div className="max-w-6xl mx-auto">
            <ServiceDeliveryChart filters={filters} />
          </div>
          <div className="max-w-6xl mx-auto">
            <Scorecard filters={filters} />
          </div>
        </main>
      </div>
    </div>
  );
}
