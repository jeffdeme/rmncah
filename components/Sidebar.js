'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { leaderboardCategories } from '../lib/dummyData'; // Import leaderboardCategories

const years = [2025, 2024, 2023];
const months = [
  { value: 1, label: '01' },
  { value: 2, label: '02' },
  { value: 3, label: '03' },
  { value: 4, label: '04' },
  { value: 5, label: '05' },
  { value: 6, label: '06' },
  { value: 7, label: '07' },
  { value: 8, label: '08' },
  { value: 9, label: '09' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
];
const lgas = [
  'All', 'Bassa', 'Barkin Ladi', 'Bokkos', 'Jos North', 'Jos South', 'Jos East', 'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua’an Pan', 'Riyom', 'Shendam', 'Wase'
];
const pages = [
  {
    type: 'link', href: '/#', label: 'Public Dashboard', icon: (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>
    )
  },
  {
    type: 'link', href: '/Login', label: 'LGA Upload (Admin)', icon: (
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12v6m0 0l-3-3m3 3l3-3" /><path d="M4 6v6a8 8 0 0016 0V6" /></svg>
    )
  },
];

export default function Sidebar({ year, setYear, month, setMonth, quarter, setQuarter, selectedLgas, setSelectedLgas, selectedCategory, setSelectedCategory }) {
  const [page, setPage] = useState('public');

  const handleLgaChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);

    if (value.includes('All')) {
      setSelectedLgas(['All']);
    } else if (selectedLgas.includes('All') && value.length > 0) {
      setSelectedLgas(value);
    } else if (value.length === 0) {
      setSelectedLgas(['All']);
    } else {
      setSelectedLgas(value);
    }
  };

  return (
    <aside className="w-full max-w-xs bg-white min-h-screen p-8 border-r flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select className="px-4 py-2 border rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 min-w-[180px] font-semibold shadow" value={year} onChange={e => setYear(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quarter</label>
          <select className="px-4 py-2 border rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 min-w-[180px] font-semibold shadow" value={quarter} onChange={e => setQuarter(Number(e.target.value))}>
            <option value={0}>All Quarters</option>
            <option value={1}>Q1 (Jan-Mar)</option>
            <option value={2}>Q2 (Apr-Jun)</option>
            <option value={3}>Q3 (Jul-Sep)</option>
            <option value={4}>Q4 (Oct-Dec)</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <select className="px-4 py-2 border rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 min-w-[180px] font-semibold shadow" value={month} onChange={e => setMonth(Number(e.target.value))}>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">LGA</label>
          <select multiple={true} className="px-4 py-2 border rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 min-w-[180px] font-semibold shadow" value={selectedLgas} onChange={handleLgaChange} size="5">
            {lgas.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Page</label>
        <div className="flex flex-col gap-2">
          {pages.map(p => (
            p.type === 'radio' ? (
              <label key={p.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="page"
                  value={p.value}
                  checked={page === p.value}
                  onChange={() => setPage(p.value)}
                  className="accent-red-500"
                />
                {p.icon}
                <span className={p.value === 'public' ? 'text-red-600 font-medium' : 'text-gray-700'}>{p.label}</span>
              </label>
            ) : (
              <Link key={p.href} href={p.href} className="flex items-center gap-2 cursor-pointer">
                {p.icon}
                <span className="text-gray-700">{p.label}</span>
              </Link>
            )
          ))}
        </div>
      </div>
    </aside>
  );
}