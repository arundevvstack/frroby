const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  console.log('Testing connection and tables using Service Role Key...');
  try {
    const { data, error } = await supabase.from('initiatives').select('*').limit(1);
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.log('Table "initiatives" does not exist yet. Schema needs to be executed.');
      } else {
        console.error('Error querying initiatives:', error);
      }
    } else {
      console.log('Successfully connected! Table "initiatives" exists. Row count returned:', data.length);
    }
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

test();
