'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/session-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  experience_level:z.enum(['beginner','intermediate','experienced']),
  fitness_level:z.enum(['light','moderate','high']),
  preferred_difficulty:z.enum(['easy','moderate','challenging']),
  destinations:z.string().trim().max(500),
  duration_days:z.coerce.number().int().min(1).max(30),
  budget:z.coerce.number().int().min(500).max(1000000),
  travel_months:z.array(z.coerce.number().int().min(1).max(12)),
  high_altitude_experience:z.boolean(),
  travel_style:z.enum(['solo','couple','group']),
  interests:z.string().trim().max(1000),
});
type Values = z.infer<typeof schema>;
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const selectStyle = 'mt-2 h-12 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline focus-visible:outline-primary';

export default function Onboarding() {
  const {user,loading} = useSession();
  const [fetching,setFetching] = useState(true);
  const [loadFailed,setLoadFailed] = useState(false);
  const [error,setError] = useState('');
  const [attempt,setAttempt] = useState(0);
  const router = useRouter();
  const {register,handleSubmit,reset,watch,setValue,formState:{errors,isSubmitting}} = useForm<Values>({resolver:zodResolver(schema),defaultValues:{experience_level:'beginner',fitness_level:'moderate',preferred_difficulty:'easy',destinations:'',duration_days:5,budget:15000,travel_months:[],high_altitude_experience:false,travel_style:'group',interests:''}});
  const selectedMonths = watch('travel_months');
  useEffect(() => {
    if (loading) return;
    if (!user) {router.replace('/account');return;}
    if (!user.email_confirmed_at) {router.replace('/verify-email');return;}
    let active = true;
    setFetching(true); setLoadFailed(false); setError('');
    Promise.resolve(supabase.from('user_preferences').select('*').eq('user_id',user.id).maybeSingle()).then(({data,error})=>{
      if (!active) return;
      if(error) {setError('We couldn’t load your preferences. Try again before editing.');setLoadFailed(true);}
      else if(data) reset(data);
      setFetching(false);
    }).catch(()=>{if(active){setError('Unable to load preferences. Please try again.');setLoadFailed(true);setFetching(false);}});
    return ()=>{active=false;};
  },[user,loading,router,reset,attempt]);
  async function submit(values:Values) {
    if (!user?.email_confirmed_at) {router.replace('/verify-email');return;}
    setError('');
    try {
      const {error} = await supabase.from('user_preferences').upsert({...values,user_id:user.id,updated_at:new Date().toISOString()},{onConflict:'user_id'});
      if(error) throw error;
      toast.success('Your trail preferences are saved.');router.push('/account');
    } catch {setError('We couldn’t save your preferences. Please try again.');}
  }
  return <main className="mx-auto max-w-3xl px-6 py-16"><p className="text-xs tracking-[.2em] text-accent">A JOURNEY THAT FEELS LIKE YOU</p><h1 className="mt-4 text-5xl sm:text-6xl">Find your own pace.</h1><p className="mb-10 mt-5 max-w-xl leading-7 text-muted-foreground">Tell us a little about your experience and the places you dream of. You can update these preferences anytime. They’re not a medical fitness assessment.</p>
    {loading || fetching ? <p role="status" className="rounded-xl border bg-card p-8">Loading your trail profile…</p> : loadFailed ? <div role="alert" className="rounded-xl border p-6"><p>{error}</p><Button className="mt-4" onClick={()=>setAttempt(attempt+1)}>Try again</Button></div> : <form onSubmit={handleSubmit(submit)} className="space-y-8">
      <fieldset disabled={isSubmitting} className="grid gap-6 rounded-2xl border bg-card p-6 sm:grid-cols-2 sm:p-8"><legend className="px-2 font-medium">Your trail experience</legend>
        <label className="text-sm">Experience<select {...register('experience_level')} className={selectStyle}><option value="beginner">New to trekking</option><option value="intermediate">A few trails behind me</option><option value="experienced">Experienced trekker</option></select></label>
        <label className="text-sm">Fitness level<select {...register('fitness_level')} className={selectStyle}><option value="light">Light activity</option><option value="moderate">Regularly active</option><option value="high">High endurance</option></select></label>
        <label className="text-sm">Preferred difficulty<select {...register('preferred_difficulty')} className={selectStyle}><option value="easy">Easy</option><option value="moderate">Moderate</option><option value="challenging">Challenging</option></select></label>
        <label className="text-sm">Travel style<select {...register('travel_style')} className={selectStyle}><option value="solo">Solo</option><option value="couple">As a couple</option><option value="group">With a group</option></select></label>
        <label className="flex items-center gap-3 text-sm sm:col-span-2"><input {...register('high_altitude_experience')} type="checkbox" className="h-5 w-5 accent-primary"/>I have trekked above 3,000 metres before.</label>
      </fieldset>
      <fieldset disabled={isSubmitting} className="grid gap-6 rounded-2xl border bg-card p-6 sm:grid-cols-2 sm:p-8"><legend className="px-2 font-medium">Your next adventure</legend>
        <label className="text-sm sm:col-span-2">Preferred destinations<Input {...register('destinations')} placeholder="Uttarakhand, Kashmir, Karnataka…" maxLength={500} className="mt-2 h-12 rounded-xl"/></label>
        <label className="text-sm">Trip duration (days)<Input {...register('duration_days')} type="number" min={1} max={30} className="mt-2 h-12 rounded-xl"/>{errors.duration_days&&<span className="text-destructive">Choose 1–30 days.</span>}</label>
        <label className="text-sm">Budget per person (₹)<Input {...register('budget')} type="number" min={500} max={1000000} step={500} className="mt-2 h-12 rounded-xl"/>{errors.budget&&<span className="text-destructive">Choose a budget between ₹500 and ₹10,00,000.</span>}</label>
        <fieldset className="sm:col-span-2"><legend className="mb-3 text-sm">Preferred months (leave empty if flexible)</legend><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{months.map((month,index)=><label key={month} className="flex items-center gap-2 rounded-xl border p-3 text-xs"><input type="checkbox" checked={selectedMonths.includes(index+1)} onChange={event=>setValue('travel_months',event.target.checked?[...selectedMonths,index+1]:selectedMonths.filter(value=>value!==index+1),{shouldDirty:true})} className="h-4 w-4 accent-primary"/>{month}</label>)}</div></fieldset>
        <label className="text-sm sm:col-span-2">Interests<Textarea {...register('interests')} maxLength={1000} placeholder="Wildlife, photography, quiet campsites…" className="mt-2 min-h-28 rounded-xl"/></label>
      </fieldset>
      {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex items-center justify-between gap-4"><Link href="/account" className="text-sm text-primary underline">Back to your account</Link><Button disabled={isSubmitting} className="h-12 rounded-xl px-8">{isSubmitting?'Saving preferences…':'Save preferences'}</Button></div>
    </form>}
  </main>;
}
