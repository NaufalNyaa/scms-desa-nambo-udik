import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  nik: string;
  address: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar_url?: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  nik: string;
  address: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, retries = 3) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Jika profil tidak ditemukan, coba buat profil baru
        if (error.code === 'PGRST116' && retries > 0) {
          console.log('⚠️ Profile not found, waiting for trigger... Retries left:', retries);

          // Tunggu 1 detik untuk trigger bekerja
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Coba lagi
          return fetchProfile(userId, retries - 1);
        }

        throw error;
      }

      console.log('✅ Profile fetched:', data);
      console.log('👤 User role:', data?.role);

      setProfile(data as UserProfile);
    } catch (error) {
      console.error('❌ Error in fetchProfile:', error);

      // Jika masih gagal, coba buat profil secara manual
      if (retries === 0) {
        console.log('🔧 Attempting to create profile manually...');
        await createProfileManually(userId);
      }
    } finally {
      setLoading(false);
    }
  };

  const createProfileManually = async (userId: string) => {
    try {
      // Ambil data user dari auth.users
      const { data: authUser } = await supabase.auth.getUser();

      if (!authUser.user) return;

      const metadata = authUser.user.user_metadata;

      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          full_name: metadata?.full_name || authUser.user.email || 'User',
          nik: metadata?.nik || '0000000000000000',
          address: metadata?.address || 'Belum diisi',
          phone: metadata?.phone || null,
          role: 'user',
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(metadata?.full_name || authUser.user.email || 'User')}&background=10b981&color=fff&size=200`
        });

      if (error) {
        console.error('❌ Failed to create profile manually:', error);
        return;
      }

      console.log('✅ Profile created manually, fetching...');
      await fetchProfile(userId, 0); // Fetch tanpa retry
    } catch (error) {
      console.error('❌ Error creating profile manually:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, 0); // Fetch tanpa retry
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Manually fetch profile after login
      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      console.log('📝 Starting signup process...');

      // Step 1: Sign up with Supabase Auth (dengan metadata)
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            nik: data.nik,
            address: data.address,
            phone: data.phone || '',
            role: 'user'
          }
        }
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      console.log('✅ User created in auth.users:', authData.user.id);

      // Step 2: Tunggu trigger bekerja (1-2 detik)
      console.log('⏳ Waiting for trigger to create profile...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Fetch profile (dengan retry mechanism)
      console.log('🔍 Fetching newly created profile...');
      await fetchProfile(authData.user.id);

      return { error: null };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const isAdmin = profile?.role === 'admin';

  console.log('🔐 Auth State:', {
    hasUser: !!user,
    hasProfile: !!profile,
    role: profile?.role,
    isAdmin,
    loading
  });

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signOut, isAdmin, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
