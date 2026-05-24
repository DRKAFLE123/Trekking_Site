const { createClient } = require('@supabase/supabase-js');

// Hostinger will automatically inject these environment variables on deployment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Queries the default users table that Payload CMS automatically creates
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.log('[Supabase Connect Check] Connection details active, but table is empty or pending schema creation:', error.message);
    } else {
      console.log('[Supabase Connect Check] Successfully queried database users table!');
    }
  } catch (err) {
    console.error('[Supabase Connect Check] Connection error:', err);
  }
}

testConnection();

module.exports = supabase;
