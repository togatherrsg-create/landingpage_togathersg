import { createClient } from '@supabase/supabase-js';

// Production ToGatherSG project. The publishable key is exactly that — it ships
// inside both mobile apps already and grants nothing on its own: every table is
// gated by row-level security, and the admin dashboard's data is readable only
// by accounts whose owners row has is_admin = true.
const SUPABASE_URL = 'https://jtlylvfohvhbqrkllmsu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_3xU79ktQ1xvi4Zo6xAUV7Q_eu5mWpjT';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
