'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/session-provider';
import { Journey } from '@/lib/catalog';
import { JourneyCard } from '@/components/journeys/journey-card';
import { Button } from '@/components/ui/button';
import { Bookmark, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
export default function Page() {
  const {user,loading:authLoading} = useSession();
  const [items,setItems] = useState<Journey[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [attempt,setAttempt] = useState(0);
  const [removing,setRemoving] = useState<string|null>(null);
  useEffect(()=>{
    if(authLoading)return;
    if(!user){setItems([]);setLoading(false);return;}
    let active=true;setLoading(true);setError('');
    async function load(){
      try{
        const {data,error}=await supabase.from('wishlists').select('treks(*)').eq('user_id',user!.id);
        if(error)throw error;
        if(active)setItems((data||[]).flatMap(row=>row.treks?[row.treks as Journey]:[]));
      }catch{if(active)setError('Unable to load your saved journeys. Please try again.');}
      finally{if(active)setLoading(false);}
    }
    load();return()=>{active=false;};
  },[user,authLoading,attempt]);
  async function remove(id:string){
    if(!user)return;setRemoving(id);
    try{
      const {error}=await supabase.from('wishlists').delete().eq('trek_id',id).eq('user_id',user.id);
      if(error)throw error;
      setItems(current=>current.filter(j=>j.id!==id));toast.success('Journey removed from saved.');
    }catch{toast.error('Could not remove this journey. Please try again.');}
    finally{setRemoving(null);}
  }
  return <main className="mx-auto min-h-[70vh] max-w-[1264px] px-6 py-16"><p className="text-[10px] tracking-widest text-accent">KEEP A LITTLE WONDER CLOSE</p><h1 className="mt-4 text-5xl">Your saved <span className="italic text-primary">journeys.</span></h1>
    {loading||authLoading?<p role="status" className="py-16">Opening your collection…</p>:error?<div role="alert" className="my-10 rounded-lg border p-6"><p>{error}</p><Button onClick={()=>setAttempt(attempt+1)} className="mt-4">Try again</Button></div>:items.length?<div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{items.map(j=><div key={j.id}><JourneyCard journey={j} onRemoved={()=>setItems(current=>current.filter(item=>item.id!==j.id))}/><Button variant="ghost" disabled={removing!==null} onClick={()=>remove(j.id)} className="mt-4 gap-2 text-xs text-muted-foreground"><Trash2 size={13}/>{removing===j.id?'Removing…':'Remove from saved'}</Button></div>)}</div>:<div className="my-12 rounded-xl border border-dashed p-12 text-center"><Bookmark className="mx-auto text-primary"/><h2 className="mt-5 text-3xl">A collection of possibilities.</h2><p className="mt-3 text-sm text-muted-foreground">{user?'Save a journey that catches your eye. It will be waiting here.':'Sign in to keep your favourite trails together, wherever you go.'}</p><Link href={user?'/journeys':'/account'} className="mt-7 inline-block rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground">{user?'Explore journeys':'Sign in to save'}</Link></div>}
  </main>;
}
