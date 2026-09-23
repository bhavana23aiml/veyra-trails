import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fduxmsngilsvjhfqkkgn.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ZLogfo5k_kIqRYfmmjyGYg_O9dq0iQb';

// The publishable key is public; service-role credentials must never be used here.
export const supabase = createClient<Database>(url, key, { auth: { flowType: 'pkce', detectSessionInUrl: false } });
