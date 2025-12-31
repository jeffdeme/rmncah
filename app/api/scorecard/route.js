import supabaseAdmin from '@/lib/supabaseAdmin';

// This function needs to be robust.
// For 'Jan', the previous month is 'Dec' of the previous year.
function getPreviousMonth(year, month) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = months.indexOf(month);

    if (monthIndex === 0) { // January
        return { year: String(parseInt(year) - 1), month: "Dec" };
    } else {
        return { year, month: months[monthIndex - 1] };
    }
}

function getCategory(current, previous) {
    if (previous === 0) { // Avoid division by zero
        return { label: current > 0 ? 'Improvement' : 'On-track', color: '#22c55e', text: 'white' };
    }
    const momChange = ((current - previous) / previous) * 100;
    if (momChange >= 10) return { label: 'Improvement', color: '#22c55e', text: 'white' };
    if (momChange >= 0) return { label: 'On-track', color: '#bbf7d0', text: '#166534' };
    if (momChange >= -15) return { label: 'Progress', color: '#fde047', text: '#92400e' };
    if (momChange >= -30) return { label: 'Not On-track', color: '#f59e42', text: 'white' };
    return { label: 'Poor', color: '#ef4444', text: 'white' };
}


export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryName = searchParams.get('category');
        const year = searchParams.get('year');
        const month = searchParams.get('month');
        const lga = searchParams.get('lga');

        if (!categoryName || !year || !month) {
            return new Response(JSON.stringify({ error: 'Category, Year, and Month are required' }), { status: 400 });
        }

        // 1. Get subcategories for the given category
        const { data: categoryData, error: catErr } = await supabaseAdmin
            .from('health_categories').select('id').eq('category_name', categoryName).single();
        if (catErr) throw new Error('Invalid category');
        
        const { data: subcategories, error: subErr } = await supabaseAdmin
            .from('health_subcategories').select('subcategory_name').eq('category_id', categoryData.id);
        if (subErr) throw new Error('Could not fetch subcategories');
        
        const subcategoryNames = subcategories.map(s => s.subcategory_name);
        const columns = subcategoryNames.join(', ');

        // 2. Fetch data for the current and previous month
        const prevMonthInfo = getPreviousMonth(year, month);

        let currentMonthQuery = supabaseAdmin.from('lga_monthly_data').select(`lga, ${columns}`).eq('year', year).eq('month', month);
        let prevMonthQuery = supabaseAdmin.from('lga_monthly_data').select(`lga, ${columns}`).eq('year', prevMonthInfo.year).eq('month', prevMonthInfo.month);

        if (lga && lga !== 'All') {
            currentMonthQuery = currentMonthQuery.eq('lga', lga);
            prevMonthQuery = prevMonthQuery.eq('lga', lga);
        }

        const [currentRes, prevRes] = await Promise.all([currentMonthQuery, prevMonthQuery]);

        if (currentRes.error || prevRes.error) {
            throw new Error('Failed to fetch monthly data');
        }

        const prevDataMap = new Map(prevRes.data.map(item => [item.lga, item]));
        
        // 3. Combine data and calculate categories
        const scorecardData = currentRes.data.map(currentRow => {
            const prevRow = prevDataMap.get(currentRow.lga) || {};
            const score = {
                lga: currentRow.lga,
                values: {}
            };
            subcategoryNames.forEach(sub => {
                const currentValue = Number(currentRow[sub] || 0);
                const prevValue = Number(prevRow[sub] || 0);
                score.values[sub] = {
                    value: currentValue,
                    category: getCategory(currentValue, prevValue)
                };
            });
            return score;
        });

        return new Response(JSON.stringify({ data: scorecardData, subcategories: subcategoryNames }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}