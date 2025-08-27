import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthError } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

interface AuthActions {
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      loading: true,
      initialized: false,

      // Actions
      signIn: async (email: string, password: string) => {
        set({ loading: true });
        const supabase = createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (data.user && !error) {
          set({ user: data.user, loading: false });
        } else {
          set({ loading: false });
        }

        return { error };
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true });
        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
              `${window.location.origin}/auth/callback`,
          },
        });

        if (data.user && !error) {
          set({ user: data.user, loading: false });
        } else {
          set({ loading: false });
        }

        return { error };
      },

      signOut: async () => {
        set({ loading: true });
        const supabase = createClient();

        await supabase.auth.signOut();
        set({ user: null, loading: false });
      },

      initialize: async () => {
        if (get().initialized) return;

        set({ loading: true });
        const supabase = createClient();

        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        set({ user: session?.user ?? null, loading: false, initialized: true });

        // Listen for auth changes
        supabase.auth.onAuthStateChange((event, session) => {
          set({ user: session?.user ?? null, loading: false });
        });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        initialized: state.initialized,
      }),
    }
  )
);
