import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../data/api";

interface AuthAdmin {
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  admin: AuthAdmin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (admin: AuthAdmin) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AuthAdmin | null>(null);
  // The tokens are httpOnly cookies the client can't read, so whether we're
  // logged in is only known after asking the server.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get<AuthAdmin>("/auth/me")
      .then((res) => {
        if (!cancelled) setAdmin(res.data);
      })
      .catch(() => {
        if (!cancelled) setAdmin(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((loggedInAdmin: AuthAdmin) => {
    setAdmin(loggedInAdmin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    }
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ admin, isAuthenticated: !!admin, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}
