'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const SessionContext = createContext<{user: User | null; loading: boolean; error: string}>({user: null, loading: true, error: ''});
export function SessionContextProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const {data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === 'SIGNED_OUT') setError('');
    });
    supabase.auth.getUser().then(({data, error}) => {
      if (!active) return;
      setUser(data.user);
      if (error && error.name !== 'AuthSessionMissingError') setError('We could not verify your session. Please sign in again.');
      setLoading(false);
    }).catch(() => { if (active) { setError('Unable to reach account services. Please try again.'); setLoading(false); } });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  return <SessionContext.Provider value={{user, loading, error}}>{children}</SessionContext.Provider>;
}
export const useSession = () => useContext(SessionContext);
