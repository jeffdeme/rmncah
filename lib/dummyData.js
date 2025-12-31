// rmncah/lib/dummyData.js

export const categoryData = {
    'Maternal Health/FP': [
        'ANC1 early',
        'IPTp2 in ANC',
        'SBA/ expected births',
    ],
    'Child health/Newborn': [
        'ORS & Zinc for diarrhea',
        'Amoxyl DT for pneumonia',
        '% Child fevers as pneumonia',
        'PNC1&3/ Live births',
    ],
    'Birth Registration/Nutrition': [
        'Birth Registration <1 yrs',
        'Exclusive Breastfeeding',
        'Vitamin A',
    ],
    'Malaria/Immunization': [
        'RDT or microscopy test for fever <5 yrs',
        'ACT treatment for malaria in children',
        'BCG Vaccine',
        'Fully Imunized',
    ],
};

export const plateauLGAs = [
    'Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 'Jos South',
    'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang',
    'Pankshin', "Qua'an Pan", 'Riyom', 'Shendam', 'Wase'
];

export const performanceCategories = [
    { label: 'Improvement', color: '#22c55e', text: 'white' },
    { label: 'On-track', color: '#bbf7d0', text: '#166534' },
    { label: 'Progress', color: '#fde047', text: '#92400e' },
    { label: 'Poor', color: '#ef4444', text: 'white' },
    { label: 'Not On-track', color: '#f59e42', text: 'white' },
    { label: 'No Data', color: '#d1d5db', text: '#4b5563' } // Grey for No Data
];

// Helper to get random integer
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate comprehensive leaderboard data
const generateLeaderboardData = () => {
    const data = [];
    const years = [2023, 2024, 2025];
    const monthsInQuarter = {
        'Q1': ['January', 'February', 'March'],
        'Q2': ['April', 'May', 'June'],
        'Q3': ['July', 'August', 'September'],
        'Q4': ['October', 'November', 'December'],
    };

    years.forEach(year => {
        Object.entries(monthsInQuarter).forEach(([quarter, months]) => {
            months.forEach(month => {
                plateauLGAs.forEach((lga, index) => {
                    const entry = {
                        year,
                        month,
                        quarter,
                        lga,
                        reporting: getRandomInt(1, 0), // Dummy reporting value
                        categories: {}
                    };

                    let overallTotalScore = 0;

                    for (const categoryName in categoryData) {
                        const subCategoriesList = categoryData[categoryName];
                        const subCategoryScores = {};
                        let categoryTotal = 0;

                        subCategoriesList.forEach(sub => {
                            const score = getRandomInt(10, 100);
                            subCategoryScores[sub] = score;
                            categoryTotal += score;
                        });

                        entry.categories[categoryName] = {
                            total: categoryTotal,
                            subCategories: subCategoryScores
                        };
                        overallTotalScore += categoryTotal;
                    }

                    // Add an 'Overall' category for total scores across all categories
                    entry.categories['Overall'] = {
                        total: overallTotalScore,
                        subCategories: {} // No specific sub-categories for Overall
                    };

                    data.push(entry);
                });
            });
        });
    });

    // Sort data to determine position for each year, month, quarter, and category
    // This is a simplified sorting. In a real app, position would be dynamic based on filters.
    // For now, let's just assign a dummy position based on some criteria, or handle it dynamically in the component.

    // To make it more realistic for filtering, let's assign a position based on the 'Overall' total score
    // within each time period (year, month, quarter).
    return data;
};

export const dummyLeaderboardData = generateLeaderboardData();

export const leaderboardCategories = [
    ...Object.keys(categoryData)
];

// Extract unique years, months, and quarters from the generated data
export const years = Array.from(new Set(dummyLeaderboardData.map(item => item.year))).sort((a, b) => b - a);
export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
