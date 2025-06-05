const { createClient } = require('@supabase/supabase-js');

// Directly hardcoded Supabase credentials
const SUPABASE_URL = 'https://gpkknytgiwajhizptquv.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwa2tueXRnaXdhamhpenB0cXV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg4ODYzNSwiZXhwIjoyMDY0NDY0NjM1fQ.ZyuNvBbsbWTSfzAZhDIR-xhSNcYG5W2tBHwuv6b8Vpw';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = { supabaseAdmin };



//save