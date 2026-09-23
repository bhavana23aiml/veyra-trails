'use client';
import Link from 'next/link';
import { ArrowUpRight, Bookmark, Mountain, Clock3 } from 'lucide-react';
import { Journey, money } from '@/lib/catalog';
import { getSupabase } from '@/lib/supabase/browser';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useSession } from '@/components/auth/session-provider';
export function JourneyCard({journey:j,featured=false,onRemoved}:{journey:Journey;featured?:boolean;onRemoved?:()=>void}){
 const [busy,setBusy]=useState(false);
 const [saved,setSaved]=useState(false);
 const [checking,setChecking]=useState(false);
 const {user,loading}=useSession();
 useEffect(()=>{
  let active=true;
  setSaved(false);
  if(!user){setChecking(false);return;}
  setChecking(true);
  Promise.resolve(getSupabase().from('wishlists').select('trek_id').eq('user_id',user.id).eq('trek_id',j.id).maybeSingle()).then(({data})=>{if(active)setSaved(!!data);}).catch(()=>{if(active)setSaved(false);}).finally(()=>{if(active)setChecking(false);});
  return ()=>{active=false;};
 },[user,j.id]);
 async function save(){
  if(!user){window.location.href='/account';return;}
  const previous=saved;setBusy(true);setSaved(!previous);
  try{
   const db=getSupabase();
   const {error}=previous?await db.from('wishlists').delete().eq('user_id',user.id).eq('trek_id',j.id):await db.from('wishlists').upsert({user_id:user.id,trek_id:j.id},{onConflict:'user_id,trek_id',ignoreDuplicates:true});
   if(error)throw error;
   toast.success(previous?'Journey removed from your collection.':'Journey added to your saved collection.');
   if(previous)onRemoved?.();
  }catch{setSaved(previous);toast.error('Could not update your saved journeys. Please try again.');}finally{setBusy(false);}
 }
 return <article className="group min-w-0"><div className={`relative overflow-hidden rounded-lg ${featured?'h-72 md:h-[345px]':'h-72 md:h-[265px]'}`}><Link href={`/journeys/${j.slug}`}><img src={j.image} alt={`${j.name} landscape inspiration`} className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" loading="lazy"/></Link><span className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1.5 text-[10px] font-medium tracking-wider">{featured?'THE EDITOR’S PICK':j.difficulty.toUpperCase()}</span><button onClick={save} disabled={busy||checking||loading} aria-pressed={saved} aria-label={`${saved?'Unsave':'Save'} ${j.name}`} className="absolute right-4 top-4 rounded-full bg-card/95 p-2.5 text-primary transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-primary disabled:opacity-50"><Bookmark size={16} fill={saved?'currentColor':'none'}/></button></div>
 <div className="pt-5"><p className="text-[10px] font-medium uppercase tracking-[.2em] text-accent">{j.state} <span className="text-muted-foreground">/ Sample journey</span></p><Link href={`/journeys/${j.slug}`} className="mt-2 flex items-center justify-between gap-2"><h3 className={`${featured?'text-[34px]':'text-[28px]'} leading-tight`}>{j.name}</h3><ArrowUpRight size={22} strokeWidth={1.2}/></Link><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{j.short_description}</p><div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground"><span className="flex items-center gap-1.5"><Clock3 size={13}/>{j.duration_days} days</span><span className="flex items-center gap-1.5"><Mountain size={14}/>{j.max_altitude_m.toLocaleString()} m</span><span className="rounded-full bg-secondary px-2 py-1">{j.difficulty}</span></div><div className="mt-4 flex justify-between border-t pt-4"><p className="text-[11px] text-muted-foreground">From <strong className="ml-1 text-lg font-medium text-foreground">{money(j.price)}</strong> / person</p><Link href={`/journeys/${j.slug}`} className="text-[11px] font-medium text-primary underline underline-offset-4">Explore journey</Link></div></div></article>
}
