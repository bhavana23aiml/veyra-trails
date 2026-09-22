import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { Journey, sampleJourneys } from '@/lib/catalog';
export async function getCatalog(): Promise<{journeys: Journey[]; sample: boolean; unavailable: boolean}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return {journeys:sampleJourneys,sample:true,unavailable:true};
  try {
    const db = createClient(url,key,{auth:{persistSession:false}});
    const {data,error} = await db.from('treks').select('id,slug,name,state,short_description,description,difficulty,duration_days,distance_km,max_altitude_m,price,image,best_season,featured,is_sample,beginner_friendly').eq('status','published').order('name').limit(100);
    if (error) return {journeys:sampleJourneys,sample:true,unavailable:true};
    return {journeys:(data || []) as Journey[],sample:(data || []).every(j=>j.is_sample),unavailable:false};
  } catch { return {journeys:sampleJourneys,sample:true,unavailable:true}; }
}
