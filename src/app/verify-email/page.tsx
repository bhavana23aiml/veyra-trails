'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/session-provider';
import { authError } from '@/lib/auth-errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const schema = z.object({email: z.string().email('Enter a valid email.')});
export default function VerifyEmail() {
  const {user} = useSession();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const {register, handleSubmit, setValue, formState:{errors,isSubmitting}} = useForm<z.infer<typeof schema>>({resolver:zodResolver(schema)});
  useEffect(() => {setValue('email', user?.email || sessionStorage.getItem('verification-email') || '');}, [user, setValue]);
  useEffect(() => {if (!cooldown) return; const timer = setTimeout(() => setCooldown(cooldown - 1), 1000); return () => clearTimeout(timer);}, [cooldown]);
  async function resend({email}: z.infer<typeof schema>) {
    setError(''); setNotice('');
    try {
      const {error} = await supabase.auth.resend({type:'signup',email,options:{emailRedirectTo:`${window.location.origin}/auth/callback`}});
      if (error) throw error;
      sessionStorage.setItem('verification-email',email);
      setNotice('Verification email requested. Check your inbox and spam folder.'); setCooldown(60);
    } catch(error) {setError(authError(error));}
  }
  return <main className="mx-auto max-w-lg px-6 py-20"><p className="text-xs tracking-widest text-accent">ONE SMALL STEP</p><h1 className="mt-4 text-5xl">Check your inbox.</h1><p className="my-6 leading-7 text-muted-foreground">Open your verification link to confirm your email and set your trail preferences. Only verified accounts can use protected account features.</p>
    {user?.email_confirmed_at ? <Link href="/onboarding" className="text-primary underline">Email verified — continue to your preferences</Link> : <form onSubmit={handleSubmit(resend)} className="space-y-5"><label className="block text-sm">Email address<Input {...register('email')} type="email" autoComplete="email" className="mt-2 h-12"/>{errors.email && <span className="text-destructive">{errors.email.message}</span>}</label><p className="text-xs leading-5 text-muted-foreground">To resend to an existing account, enter its email. Signed up with a typo? Return to sign-up and create your account with the correct address; resending does not change an existing account’s email.</p><Button disabled={isSubmitting || cooldown > 0} className="h-12 w-full">{isSubmitting ? 'Requesting email…' : cooldown ? `Resend in ${cooldown}s` : 'Resend verification email'}</Button></form>}
    {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}{notice && <p role="status" className="mt-5 rounded-xl border bg-secondary p-4 text-sm">{notice}</p>}<Link href="/account" className="mt-8 inline-block text-sm text-primary underline">Back to login or sign-up</Link>
  </main>;
}
