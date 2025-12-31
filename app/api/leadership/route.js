// app/api/leadership/route.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category_id = searchParams.get('category_id'); // filter by category
        const year = Number(searchParams.get('year'));
        const month = searchParams.get('month');            // optional
        const quarter = searchParams.get('quarter');        // optional

        let query = supabaseAdmin
            .from('lga_monthly_data')
            .select('lga_name, value', { count: 'exact' })
            .eq('category_id', category_id)
            .eq('year', year);

        if (month) query = query.eq('month', month);
        if (quarter) query = query.eq('quarter', quarter);

        const { data, error } = await query;

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        // Aggregate total value per LGA
        const aggregate = data.reduce((acc, row) => {
            if (!acc[row.lga_name]) acc[row.lga_name] = 0;
            acc[row.lga_name] += row.value;
            return acc;
        }, {});

        // Convert to array and sort descending by total value
        const sorted = Object.entries(aggregate)
            .map(([lga_name, total_value]) => ({ lga_name, total_value }))
            .sort((a, b) => b.total_value - a.total_value)
            .slice(0, 3); // top 3

        return new Response(
            JSON.stringify({
                top3: sorted,
                total_reported: Object.keys(aggregate).length
            }),
            { status: 200 }
        );

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}