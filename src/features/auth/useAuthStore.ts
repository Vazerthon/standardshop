import { create } from "zustand";
import { db } from "../../lib/db";

interface AuthState {
  getMagicCode: () => Promise<void>;
  verifyMagicCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  message: string | null;
  waitingForCode: boolean;
  email: string | undefined;
  setEmail: (email: string | undefined) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  loading: false,
  message: null,
  waitingForCode: false,
  email: undefined,

  setEmail: (email: string | undefined) => {
    set({ email });
  },

  getMagicCode: async () => {
    const email = get().email;

    if (!email) {
      set({ message: 'Please enter your email address.' });
      return;
    }

    set({ loading: true });
    set({ message: null });
    try {
      await db.auth.sendMagicCode({ email });
      set({ waitingForCode: true });
      set({ message: 'Check your email for the magic code!' });
    } catch (error) {
      set({ waitingForCode: false });
      set({ message: 'Error signing in. Please try again.' });
    } finally {
      set({ loading: false });
    }
  },

  verifyMagicCode: async (code: string) => {
    const email = get().email;

    if (!email) {
      set({ message: 'Please enter your email address.' });
      return;
    }

    set({ loading: true });
    set({ message: null });

    try {
      await db.auth.signInWithMagicCode({ code, email });
      set({ message: 'Magic code verified successfully!' });
    } catch (error) {
      set({ message: 'Error verifying magic code. Please try again.' });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    set({ message: null });
    await db.auth.signOut();
    set({ loading: false });
  },
}));

// Custom hooks for specific functionality
export const useAuthLoading = () => useAuthStore((state) => state.loading);
export const useAuthMessage = () => useAuthStore((state) => state.message);
export const useAuthGetMagicCode = () => useAuthStore((state) => state.getMagicCode);
export const useAuthSignOut = () => useAuthStore((state) => state.signOut);
export const useAuthWaitingForCode = () => useAuthStore((state) => state.waitingForCode);
export const useAuthVerifyMagicCode = () => useAuthStore((state) => state.verifyMagicCode);
export const useAuthEmail = () => useAuthStore((state) => state.email);
export const useSetAuthEmail = () => useAuthStore((state) => state.setEmail);