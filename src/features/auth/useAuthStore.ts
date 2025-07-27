import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  message: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setMessage: (message: string | null) => void;
  clearMessage: () => void;
  initializeAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  message: null,
  
  initializeAuth: async () => {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, loading: false });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },
  
  signIn: async (email: string, password: string) => {
    set({ loading: true, message: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (data.user) {
      set({ user: data.user, session: data.session, loading: false, message: 'Login successful!' });
    } else {
      set({ loading: false, message: error?.message || 'Something went wrong, please try again' });
    }
    
    return { error };
  },
  
  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ user: null, session: null, loading: false, message: null });
  },
  
  setUser: (user: User | null) => set({ user }),
  setSession: (session: Session | null) => set({ session }),
  setLoading: (loading: boolean) => set({ loading }),
  setMessage: (message: string | null) => set({ message }),
  clearMessage: () => set({ message: null }),
}));

// Custom hooks for specific functionality
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthSession = () => useAuthStore((state) => state.session);
export const useAuthLoading = () => useAuthStore((state) => state.loading);
export const useAuthMessage = () => useAuthStore((state) => state.message);
export const useAuthSignIn = () => useAuthStore((state) => state.signIn);
export const useAuthSignOut = () => useAuthStore((state) => state.signOut);
export const useAuthInitialize = () => useAuthStore((state) => state.initializeAuth);
