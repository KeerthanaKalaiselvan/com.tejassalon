"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (mobile: string, password: string) => Promise<User>;
  register: (mobile: string, password: string, name?: string) => Promise<User>;
  completeOnboarding: (serviceIds: string[]) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: User }>("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (mobile: string, password: string) => {
    const data = await apiFetch<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ mobile, password }),
    });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (mobile: string, password: string, name?: string) => {
    const data = await apiFetch<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ mobile, password, name }),
    });
    setUser(data.user);
    return data.user;
  }, []);

  const completeOnboarding = useCallback(async (serviceIds: string[]) => {
    const data = await apiFetch<{ user: User }>("/api/auth/onboarding", {
      method: "POST",
      body: JSON.stringify({ serviceIds }),
    });
    setUser((prev) => (prev ? { ...prev, ...data.user } : data.user));
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        login,
        register,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
