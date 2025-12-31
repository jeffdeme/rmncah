import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
    try {
        // Simple test query
        const { data, error } = await supabaseAdmin
            .from('lga_admins')
            .select('id')
            .limit(1);

        if (error) throw error;

        return new Response(
            JSON.stringify({ status: 'success', message: 'Server and database are running', sample: data }),
            { status: 200 }
        );
    } catch (err) {
        return new Response(JSON.stringify({ status: 'error', message: err.message }), { status: 500 });
    }
}
