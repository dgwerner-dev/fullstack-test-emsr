import { Request } from 'express';

// Tipos para Request com usuário autenticado
export interface AuthenticatedRequest extends Request {
  userId: string;
  role: 'USER' | 'ADMIN';
}

// Tipos para criação de eventos
export interface CreateEventData {
  name: string;
  description?: string;
  eventDate: Date;
  maxCapacity: number;
  location?: string;
  creatorId: string;
}

// Tipos para atualização de eventos
export interface UpdateEventData {
  name?: string;
  description?: string;
  eventDate?: Date;
  maxCapacity?: number;
  location?: string;
}

// Tipos para criação de usuários
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

// Tipos para atualização de usuários
export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
}

// Tipos para reservas
export interface CreateReservationData {
  eventId: string;
  userId: string;
}

// Tipos para filtros de eventos
export interface EventFilters {
  date?: string;
  name?: string;
}

// Tipos para resposta de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos para payload JWT
export interface JWTPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  iat: number;
  exp: number;
}

// Tipos para eventos do socket
export interface SocketEventData {
  eventId: string;
  userId?: string;
}

// Tipos para cache
export interface CacheData {
  key: string;
  value: string;
  ttl?: number;
}
