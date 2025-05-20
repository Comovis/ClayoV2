const { createClient } = require('@supabase/supabase-js');

// Directly hardcoded Supabase credentials
const SUPABASE_URL = 'https://vvtzvlzhldqsvezfdfyd.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dHp2bHpobGRxc3ZlemZkZnlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzU3MDA4MywiZXhwIjoyMDYzMTQ2MDgzfQ.haIt02LjdzvL09t8nUvw-6jH3zZ65dXEI0zB3Dv5AkA';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = { supabaseAdmin };



//save