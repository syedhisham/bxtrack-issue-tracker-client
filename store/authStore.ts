import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import { authAPI } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(email);
          const { user, token } = response.data;

          // Store token in localStorage for API client
          localStorage.setItem("token", token);

          // Set cookie for middleware to read (same domain as frontend)
          if (typeof document !== "undefined") {
            const isSecure = window.location.protocol === "https:";
            const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
            document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? "; Secure" : ""}`;
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          localStorage.removeItem("token");
          
          // Clear cookie for middleware
          if (typeof document !== "undefined") {
            document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
          }
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        localStorage.setItem("token", token);
        
        // Set cookie for middleware to read
        if (typeof document !== "undefined") {
          const isSecure = window.location.protocol === "https:";
          const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
          document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? "; Secure" : ""}`;
        }
        
        set({ token, isAuthenticated: true });
      },

      checkAuth: () => {
        const { token, user } = get();
        if (token && user) {
          // Verify token is still in localStorage (synced with API client)
          const storedToken = localStorage.getItem("token");
          if (storedToken === token) {
            set({ isAuthenticated: true });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
