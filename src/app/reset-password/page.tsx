'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/session-provider';
import { authError } from '@/lib/auth-errors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const schema = z.object({password:z.string().min(8,'Use at least 8 characters.').max(128),confirm:z.string()}).refine(v=>v.password===v.confirm,{path:['confirm'],message:'Passwords must match.'});
export default function ResetPassword() {
  const {user,loading} = useSession();
  const router = useRouter();
  const [error,setError] = useState('');
  const {register,handleSubmit,formState:{errors,isSubmitting}} = useForm<z.infer<typeof schema>>({resolver:zodResolver(schema)});
  async function submit({password}:z.infer<typeof schema>) {
    setError('');
    try {const {error} = await supabase.auth.updateUser({password}); if(error) throw error; toast.success('Your password has been updated.'); router.replace('/account');}
    catch(error) {setError(authError(error));}
  }
  return <main className="mx-auto max-w-md px-6 py-20"><h1 className="mb-8 text-5xl">A fresh start.</h1>{loading ? <p role="status">Checking your session…</p> : !user?.email_confirmed_at ? <p>Open your password reset email or <Link href="/account" className="text-primary underline">sign in with a verified account</Link> to update your password.</p> : <form onSubmit={handleSubmit(submit)} className="space-y-5">{(['password','confirm'] as const).map(name=><label key={name} className="block text-sm">{name==='password'?'New password':'Confirm password'}<Input {...register(name)} type="password" autoComplete="new-password" className="mt-2 h-12"/>{errors[name] && <span className="text-destructive">{errors[name]?.message}</span>}</label>)}{error&&<p role="alert" className="text-sm text-destructive">{error}</p>}<Button disabled={isSubmitting} className="h-12 w-full">{isSubmitting?'Updating…':'Update password'}</Button></form>}</main>;
}
