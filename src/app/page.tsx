import { getCatalog } from '@/lib/supabase/catalog';
import { HomeEditorial } from '@/components/editorial/home';
export const revalidate = 60;
export default async function Home(){const {journeys}=await getCatalog();return <HomeEditorial journeys={journeys}/>}
