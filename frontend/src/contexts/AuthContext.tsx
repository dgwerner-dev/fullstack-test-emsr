"use client";

import { login as apiLogin, register as apiRegister } from "@/services/auth";
import { createContext, useContext, useEffect, useState } from "react";

function decodeJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    console.log("[AuthContext] useEffect token:", t);
    if (t) {
      setToken(t);
      try {
        const decoded: any = decodeJwt(t);
        console.log("[AuthContext] Decoded token:", decoded);
        setUser({ id: decoded.userId, role: decoded.role, email: decoded.email, name: decoded.name });
      } catch (err) {
        console.error("[AuthContext] Error decoding token:", err);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  async function login(data: { email: string; password: string }) {
    const res = await apiLogin(data);
    setToken(res.token);
    localStorage.setItem("token", res.token);
    try {
      const decoded: any = decodeJwt(res.token);
      console.log("[AuthContext] Decoded token after login:", decoded);
      setUser({ id: decoded.userId, role: decoded.role, email: decoded.email, name: decoded.name });
    } catch (err) {
      console.error("[AuthContext] Error decoding token after login:", err);
      setUser(null);
    }
  }

  async function register(data: { name: string; email: string; password: string }) {
    const res = await apiRegister(data);
    setToken(res.token);
    localStorage.setItem("token", res.token);
    try {
      const decoded: any = decodeJwt(res.token);
      console.log("[AuthContext] Decoded token after register:", decoded);
      setUser({ id: decoded.userId, role: decoded.role, email: decoded.email, name: decoded.name });
    } catch (err) {
      console.error("[AuthContext] Error decoding token after register:", err);
      setUser(null);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
