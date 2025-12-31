import supabaseAdmin from '@/lib/supabaseAdmin';

// Basic CSV parser
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const header = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        return header.reduce((obj, nextKey, index) => {
            obj[nextKey] = values[index];
            return obj;
        }, {});
    });
    return rows;
}

export async function POST(req) {
    try {
        // 1. Authenticate the user
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Missing or invalid authorization header' }), { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 2. Process the CSV data
        const csvData = await req.text();
        const jsonData = parseCSV(csvData);

        if (!jsonData || jsonData.length === 0) {
            return new Response(JSON.stringify({ error: 'CSV is empty or invalid.' }), { status: 400 });
        }

        const requiredColumns = ['lga', 'year', 'month'];
        for (const row of jsonData) {
            for (const col of requiredColumns) {
                if (!row[col]) {
                    return new Response(JSON.stringify({ error: `Missing required column '${col}' in at least one row.` }), { status: 400 });
                }
            }
        }
        
        const { data, error } = await supabaseAdmin
            .from('lga_monthly_data')
            .upsert(jsonData, { onConflict: 'lga, year, month' });

        if (error) {
            console.error('Supabase Error:', error);
            if (error.message.includes("is not a column in table")) {
                 return new Response(JSON.stringify({ error: `Database schema mismatch. Details: ${error.message}` }), { status: 400 });
            }
            return new Response(JSON.stringify({ error: `Supabase error: ${error.message}` }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: 'Data processed successfully', processedRows: jsonData.length }), { status: 200 });

    } catch (err) {
        console.error('API Error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
