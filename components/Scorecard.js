'use client';
import React, { useState, useEffect } from 'react';

import { categoryData, plateauLGAs, performanceCategories } from '../lib/dummyData';

const categories = Object.keys(categoryData);

// Function to generate random integer
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to convert number to Roman numeral
const toRoman = (num) => {
    const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let str = '';
    for (let i of Object.keys(roman)) {
        let q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
    }
    return str.toLowerCase();
};


export default function Scorecard({ filters }) {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [subcategories, setSubcategories] = useState(categoryData[selectedCategory]);
    const [scorecardData, setScorecardData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const newSubcategories = categoryData[selectedCategory];
            setSubcategories(newSubcategories);

            const noDataCategory = performanceCategories.find(cat => cat.label === 'No Data');

            const newScorecardData = (filters.selectedLgas.includes('All') ? plateauLGAs : filters.selectedLgas).map(lga => {
                const values = {};
                newSubcategories.forEach(sub => {
                    if (filters.month === 1 && filters.year === 2023) {
                        values[sub] = {
                            value: '-',
                            category: noDataCategory
                        };
                    } else {
                        values[sub] = {
                            value: getRandomInt(50, 800),
                            category: performanceCategories[getRandomInt(0, performanceCategories.length - 1)]
                        };
                    }
                });
                return { lga, values };
            });

            setScorecardData(newScorecardData);
            setLoading(false);
        }, 500); // Simulate loading

        return () => clearTimeout(timer);
    }, [selectedCategory, filters]);

    const handleDownloadCSV = () => {
        const headers = ['LGA'];
        subcategories.forEach((sub) => { // Removed Roman numeral here
            headers.push(`${sub} Percentage`, `${sub} KPI`); // Adjusted headers for CSV
        });

        const rows = scorecardData.map(row => {
            const rowData = [row.lga];
            subcategories.forEach(sub => {
                const subData = row.values[sub];
                if (subData) {
                    rowData.push(subData.value, subData.category.label);
                } else {
                    rowData.push('', '');
                }
            });
            return rowData;
        });

        const csvContent = [headers, ...rows]
            .map(row => row.map(String).map(v => `"${v.replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'scorecard.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Scorecar</h2>
                <div className="relative">
                    <select
                        className="px-4 py-2 border rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 min-w-[180px] font-semibold shadow"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((cat) => ( // Removed Roman numeral here
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
            {loading ? (
                 <div className="text-center text-gray-500 py-10">Loading scorecard...</div>
            ) : !scorecardData || scorecardData.length === 0 ? (
                 <div className="text-center text-gray-500 py-10">No data available for the selected filters.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-lg overflow-hidden text-sm">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="px-3 py-2">LGA</th>
                                {subcategories.map((sub) => ( // Removed Roman numeral here
                                    <th key={sub} className="px-3 py-2">{`${sub} (%)`}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {scorecardData.map((row) => (
                                <tr key={row.lga} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="px-3 py-2 font-semibold">{row.lga}</td>
                                    {subcategories.map(sub => {
                                        const subData = row.values[sub];
                                        return subData ? (
                                            <td key={`${row.lga}-${sub}`} className="px-3 py-2 font-bold" style={{ background: subData.category.color, color: subData.category.text }}>
                                                {subData.value} {subData.value !== '-' ? `(${subData.category.label})` : ''}
                                            </td>
                                        ) : (
                                            <td key={`${row.lga}-${sub}`} className="px-3 py-2">N/A</td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="flex justify-start mt-6">
                <button
                    className="border px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 shadow disabled:opacity-50"
                    onClick={handleDownloadCSV}
                    disabled={loading || scorecardData.length === 0}
                >
                    Download scorecard (CSV)
                </button>
            </div>
        </div>
    );
}
