'use client';

import {
  login as loginService,
  register as registerService,
} from '@/services/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setToken(t);
      const decoded: any = decodeJwt(t);
      if (decoded) {
        setUser({
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      const newSocket = io(
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      );
      setSocket(newSocket);
      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await loginService({ email, password });
    const decoded: any = decodeJwt(res.token);
    if (decoded) {
      setUser({
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      });
    }
    setToken(res.token);
    localStorage.setItem('token', res.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerService({ name, email, password });
    const decoded: any = decodeJwt(res.token);
    if (decoded) {
      setUser({
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      });
    }
    setToken(res.token);
    localStorage.setItem('token', res.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, socket }}
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
