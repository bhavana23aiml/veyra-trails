'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/session-provider';
import { authError } from '@/lib/auth-errors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.').max(120),
  phone: z.string().regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid phone number.'),
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(8, 'Use at least 8 characters.').max(128),
  confirm: z.string(),
}).refine(v => v.password === v.confirm, {path: ['confirm'], message: 'Passwords must match.'});
type Values = z.infer<typeof schema>;

export function AccountForm() {
  const [mode, setMode] = useState<'login'|'signup'|'forgot'>('login');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const {user, loading, error: sessionError} = useSession();
  const router = useRouter();
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<Values>({resolver: zodResolver(schema)});
  async function signup(values: Values) {
    setError('');
    try {
      const {data, error} = await supabase.auth.signUp({email: values.email, password: values.password, options: {data: {full_name: values.name, phone: values.phone}, emailRedirectTo: `${window.location.origin}/auth/callback`}});
      if (error) throw error;
      sessionStorage.setItem('verification-email', values.email);
      router.push(data.session && data.user?.email_confirmed_at ? '/onboarding' : '/verify-email');
    } catch (error) { setError(authError(error)); }
  }
  async function logout() {
    setBusy(true); setError('');
    try { const {error} = await supabase.auth.signOut(); if (error) throw error; }
    catch (error) { setError(authError(error)); }
    finally { setBusy(false); }
  }
  if (loading) return <p role="status" className="p-16 text-center text-muted-foreground">Opening your adventure home…</p>;
  if (user) return <section className="mx-auto max-w-3xl px-6 py-20">
    <p className="text-xs tracking-widest text-accent">ADVENTURE HOME</p><h1 className="mt-4 text-5xl">Welcome back, {user.user_metadata.full_name || 'explorer'}.</h1>
    <p className="mt-5 text-muted-foreground">{user.email}</p>
    <p className="mt-3 text-sm">{user.email_confirmed_at ? 'Your email is verified.' : 'Verify your email before making reservations.'}</p>
    {!user.email_confirmed_at && <Link href="/verify-email" className="mt-4 inline-block text-primary underline">Verify your email</Link>}
    <div className="mt-10 grid gap-5 sm:grid-cols-2">{[
      ['/saved', 'Your saved trails', 'Keep your next adventure close.'],
      ['/journeys', 'Continue exploring', 'There’s more around the bend.'],
      ['/onboarding', 'Your trail preferences', 'Tell us how you like to adventure.'],
      ['/reset-password', 'Account security', 'Update your account password.'],
    ].map(([href, title, copy]) => <Link key={href} className="rounded-xl border bg-card p-8 transition-colors hover:border-primary focus-visible:outline focus-visible:outline-primary" href={href}><h2 className="text-3xl">{title}</h2><p className="mt-3 text-sm text-muted-foreground">{copy}</p></Link>)}</div>
    <div className="my-8 rounded-xl border border-dashed p-8"><h2 className="text-2xl">Your journey is still ahead.</h2><p className="mt-3 text-sm text-muted-foreground">Reservations are not open yet. Verified departures will be available before booking launches.</p></div>
    {error && <p role="alert" className="mb-4 text-destructive">{error}</p>}<Button variant="outline" disabled={busy} onClick={logout}>{busy ? 'Signing out…' : 'Sign out'}</Button>
  </section>;
  return <section className="mx-auto max-w-md px-6 py-16">
    <p className="text-[10px] tracking-[.2em] text-accent">YOUR NEXT CHAPTER</p><h1 className="mt-4 text-5xl">{mode === 'signup' ? 'Begin your story.' : mode === 'forgot' ? 'Find your way back.' : 'Welcome, explorer.'}</h1><p className="mb-8 mt-4 text-sm text-muted-foreground">A place for your plans, your trails, your possibilities.</p>
    {(error || sessionError) && <p role="alert" className="mb-4 text-sm text-destructive">{error || sessionError}</p>}
    {mode === 'signup' ? <form onSubmit={handleSubmit(signup)} className="space-y-5">
      {([{name:'name', label:'Full name', type:'text', autoComplete:'name'}, {name:'phone', label:'Phone', type:'tel', autoComplete:'tel'}, {name:'email', label:'Email', type:'email', autoComplete:'email'}, {name:'password', label:'Password', type:'password', autoComplete:'new-password'}, {name:'confirm', label:'Confirm password', type:'password', autoComplete:'new-password'}] as const).map(field => <label key={field.name} className="block text-xs">{field.label}<Input {...register(field.name)} type={field.type} autoComplete={field.autoComplete} aria-invalid={!!errors[field.name]} className="mt-2 h-12 bg-card"/>{errors[field.name] && <span role="alert" className="mt-1 block text-destructive">{errors[field.name]?.message}</span>}</label>)}
      <Button disabled={isSubmitting} className="h-12 w-full">{isSubmitting ? 'Creating account…' : 'Create account'}</Button>
    </form> : <Auth supabaseClient={supabase} providers={[]} view={mode === 'forgot' ? 'forgotten_password' : 'sign_in'} showLinks={false} redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback${mode === 'forgot' ? '?next=recovery' : ''}` : undefined} theme="light" appearance={{theme: ThemeSupa, className: {button:'!rounded-xl !min-h-12',input:'!rounded-xl !min-h-12',container:'!gap-5'},variables:{default:{colors:{brand:'#345744',brandAccent:'#284535',inputBackground:'transparent',inputText:'#253b2e',inputLabelText:'#47594c',inputBorder:'#ccd4cc'},radii:{borderRadiusButton:'12px',inputBorderRadius:'12px'}}}}}/>}
    <div className="mt-6 flex flex-wrap justify-between gap-4 text-xs text-primary"><Button variant="link" className="h-auto p-0" onClick={() => {setMode(mode === 'login' ? 'signup' : 'login');setError('');}}>{mode === 'login' ? 'New here? Create an account' : 'Return to sign in'}</Button>{mode === 'login' && <Button variant="link" className="h-auto p-0" onClick={() => setMode('forgot')}>Forgot password?</Button>}</div>
    <Link href="/verify-email" className="mt-5 inline-block text-xs text-primary underline">Need another verification email?</Link>
  </section>;
}
