import { Suspense } from 'react';
import { getCatalog } from '@/lib/supabase/catalog';
import { Explorer } from '@/components/journeys/explorer';
export const metadata={title:'Explore Journeys'};
export const revalidate=60;
export default async function Page(){const {journeys}=await getCatalog();return <Suspense fallback={<p className="p-16">Finding your trails…</p>}><Explorer journeys={journeys}/></Suspense>}
