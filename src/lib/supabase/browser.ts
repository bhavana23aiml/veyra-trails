import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';
let client: SupabaseClient<Database> | null = null;
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient<Database>(url, key);
  return client;
}
