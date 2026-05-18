import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  isAdmin: false,
  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user,
      isAdmin: (user?.role ?? 0) >= 1,
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      isLoading: false,
    }),
}));
