import { getCatalog } from '@/lib/supabase/catalog';
import { Matcher } from '@/components/journeys/matcher';
export const metadata={title:'Find Your Trail'};
export default async function Page(){const {journeys}=await getCatalog();return <Matcher journeys={journeys}/>}
