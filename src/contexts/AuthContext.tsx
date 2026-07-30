import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile, UserRole } from '@/types';
import { store } from '@/lib/store';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  setRole: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with admin demo user by default if Supabase session is not active
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      setIsLoading(true);
      try {
        const { data: { session: supaSession } } = await supabase.auth.getSession();
        if (supaSession?.user && mounted) {
          setSession(supaSession);
          setUser(supaSession.user);
          const { data } = await supabase.from('profiles').select('*').eq('id', supaSession.user.id).single();
          if (data && mounted) {
            setProfile(data as Profile);
          } else if (mounted) {
            setProfile(store.profiles[0]);
          }
        } else if (mounted) {
          // Fallback to active demo profile (Admin default)
          const defaultProfile = store.profiles[0];
          setProfile(defaultProfile);
          setUser({ id: defaultProfile.id, email: defaultProfile.email } as User);
          setSession({ user: { id: defaultProfile.id } } as Session);
        }
      } catch {
        if (mounted) {
          const defaultProfile = store.profiles[0];
          setProfile(defaultProfile);
          setUser({ id: defaultProfile.id, email: defaultProfile.email } as User);
          setSession({ user: { id: defaultProfile.id } } as Session);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        const { data } = await supabase.from('profiles').select('*').eq('id', newSession.user.id).single();
        if (data) setProfile(data as Profile);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const setRole = (role: UserRole) => {
    const matched = store.profiles.find(p => p.role === role) || {
      id: `usr-${role}-temp`,
      email: `${role}@university.edu`,
      full_name: `Demo ${role.replace('_', ' ').toUpperCase()}`,
      role,
    };
    setProfile(matched);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, setRole, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
