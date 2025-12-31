'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

import { categoryData, plateauLGAs } from '../lib/dummyData';

// Function to generate random integer
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const categories = Object.keys(categoryData);

// Define a set of distinct colors for the bars
const barColors = [
    '#8884d8', // Purple
    '#82ca9d', // Green
    '#ffc658', // Yellow/Orange
    '#fd6a6a', // Red
    '#1e90ff', // Dodger Blue
    '#ff7f50', // Coral
    '#6a5acd', // Slate Blue
    '#00ced1', // Dark Turquoise
    '#ffa500', // Orange
    '#da70d6', // Orchid
    '#adff2f', // Green Yellow
    '#7b68ee', // Medium Slate Blue
    '#ff69b4', // Hot Pink
    '#20b2aa', // Light Sea Green
    '#ba55d3', // Medium Orchid
    '#87cefa', // Light Sky Blue
    '#32cd32', // Lime Green
];



export default function ServiceDeliveryChart({ filters }) {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [subcategories, setSubcategories] = useState(categoryData[selectedCategory]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const newSubcategories = categoryData[selectedCategory];
            setSubcategories(newSubcategories);

            const lgasToDisplay = filters.selectedLgas.includes('All') ? plateauLGAs : filters.selectedLgas;

            const newChartData = lgasToDisplay.map(lga => {
                let entry = { lga };
                newSubcategories.forEach(sub => {
                    entry[sub] = getRandomInt(50, 800);
                });
                return entry;
            });

            setChartData(newChartData);
            setLoading(false);
        }, 500); // Simulate loading

        return () => clearTimeout(timer);
    }, [selectedCategory, filters]);

    // Custom label component for stacked bars
    const renderCustomizedLabel = (props) => {
        const { x, y, width, value } = props;
        if (value > 0) {
            return (
                <text x={x + width / 2} y={y - 5} fill="#333" textAnchor="middle" dominantBaseline="middle" fontSize={10}>
                    {value}
                </text>
            );
        }
        return null;
    };

    const containerWidth = chartData.length > 0 ? Math.max(chartData.length * 80 + 60, 400) : '100%';

    return (
        <div id="service-delivery-chart" className="bg-white p-6 rounded-2xl shadow-lg max-w-6xl mx-auto">
            <div className="flex items-center mb-4 justify-between">
                <h2 className="text-xl font-bold text-gray-800">Service Delivery by LGA </h2>
                <div className="relative">
                    <select
                        className="px-4 py-2 border rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 min-w-[180px] font-semibold shadow"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
            {loading ? (
                <div className="text-center text-gray-500 py-10">Loading chart data...</div>
            ) : chartData.length === 0 ? (
                <div className="text-center text-gray-500 py-10">No data available for the selected filters.</div>
            ) : (
                <div className="overflow-x-auto" style={{ width: '100%', minHeight: 350 }}>
                    <ResponsiveContainer width={containerWidth} height={450}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            barCategoryGap={10}
                            barSize={36}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="lga" angle={-45} textAnchor="end" interval={0} height={70} tick={{ fontSize: 12 }} />
                            <YAxis>
                                <Label value="Value" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            {subcategories.map((sub, idx) => (
                                <Bar
                                    key={sub}
                                    dataKey={sub}
                                    fill={barColors[idx % barColors.length]}
                                    name={sub}
                                    radius={[4, 4, 0, 0]}
                                    label={renderCustomizedLabel} // Add labels
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
            <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t">
                {subcategories.map((sub, idx) => (
                    <div key={sub} className="flex items-center space-x-2">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: barColors[idx % barColors.length] }}></span>
                        <span className="text-sm text-gray-600">{sub}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
