import supabase from '../../../lib/supabase';

export async function POST(req) {
    const { lga_name, passcode } = await req.json();

    const { data, error } = await supabase
        .from('lga_admins')   // your table with LGA login info
        .select('*')
        .eq('lga_name', lga_name)
        .eq('passcode', passcode);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!data || data.length === 0) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: 'Access granted' }), { status: 200 });
}
