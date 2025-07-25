"use client";

import { login as apiLogin, register as apiRegister } from "@/services/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
    // Aqui você pode decodificar o token e setar o user, se quiser
  }, []);

  async function login(data: { email: string; password: string }) {
    const res = await apiLogin(data);
    setToken(res.token);
    localStorage.setItem("token", res.token);
    // Decodifique o token se quiser setar o user
  }

  async function register(data: { name: string; email: string; password: string }) {
    const res = await apiRegister(data);
    setToken(res.token);
    localStorage.setItem("token", res.token);
    // Decodifique o token se quiser setar o user
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
