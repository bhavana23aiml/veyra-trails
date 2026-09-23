'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Link from 'next/link';
import { toast } from 'sonner';

export default function Page() {
  const started = useRef(false);
  const [message,setMessage] = useState('Checking your verification link…');
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    async function verify() {
      const url = new URL(window.location.href);
      if (url.searchParams.has('error')) throw new Error('This link is invalid or has expired. Please request another email.');
      const code = url.searchParams.get('code');
      if (code) {
        const {error} = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw new Error('This link has expired or was opened in a different browser. Request a new link and open it in the browser where you requested it.');
        window.history.replaceState({}, '', '/auth/callback');
      }
      const {data:{user},error} = await supabase.auth.getUser();
      if (error || !user) throw new Error('We could not validate your session. Please request a new link.');
      if (url.searchParams.get('next') === 'recovery') {window.location.replace('/reset-password'); return;}
      if (!user.email_confirmed_at) throw new Error('Your email is not yet verified. Please request another verification email.');
      sessionStorage.removeItem('verification-email');
      toast.success('Email verified. Welcome to your next chapter.');
      window.location.replace('/onboarding');
    }
    verify().catch(error => setMessage(error instanceof Error ? error.message : 'Verification failed. Please try again.'));
  }, []);
  return <main className="mx-auto max-w-xl px-6 py-24"><h1 className="text-4xl">One small step before the trail begins.</h1><p role="status" className="my-6 text-muted-foreground">{message}</p><div className="flex gap-6"><Link href="/verify-email" className="text-primary underline">Request a new link</Link><Link href="/account" className="text-primary underline">Return to your account</Link></div></main>;
}
