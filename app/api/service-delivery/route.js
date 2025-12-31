import supabaseAdmin from '@/lib/supabaseAdmin';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const month = searchParams.get('month');
        const year = searchParams.get('year');
        const lga = searchParams.get('lga');

        if (!category) {
            return new Response(JSON.stringify({ error: 'Category is required' }), { status: 400 });
        }

        // 1️⃣ Get category ID
        const { data: categoryData, error: catErr } = await supabaseAdmin
            .from('health_categories')
            .select('id')
            .eq('category_name', category)
            .single();

        if (catErr || !categoryData) {
            return new Response(JSON.stringify({ error: 'Invalid category' }), { status: 404 });
        }

        // 2️⃣ Get subcategories (column names)
        const { data: subcategories, error: subErr } = await supabaseAdmin
            .from('health_subcategories')
            .select('subcategory_name')
            .eq('category_id', categoryData.id);

        if (subErr || !subcategories.length) {
            return new Response(JSON.stringify({ data: [], subcategories: [] }), { status: 200 });
        }

        const subcategoryNames = subcategories.map(s => s.subcategory_name);
        const columns = subcategoryNames.join(', ');

        // 3️⃣ Fetch data
        let query = supabaseAdmin
            .from('lga_monthly_data')
            .select(`lga, ${columns}`);

        if (month) query = query.eq('month', month);
        if (year) query = query.eq('year', year);
        if (lga && lga !== 'All') query = query.eq('lga', lga);

        const { data, error } = await query;

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        // 4️⃣ Format data for the chart
        const chartData = data.map(row => {
            const entry = { lga: row.lga };
            subcategoryNames.forEach(sub => {
                entry[sub] = Number(row[sub] || 0);
            });
            return entry;
        });

        return new Response(
            JSON.stringify({
                data: chartData,
                subcategories: subcategoryNames
            }),
            { status: 200 }
        );

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}