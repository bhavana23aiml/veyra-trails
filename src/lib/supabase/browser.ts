import { supabase } from '@/integrations/supabase/client';

export function getSupabase() {
  return supabase;
}
