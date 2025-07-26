import { PrismaClient } from '@prisma/client';
import { redis } from '../utils/redis';

const prisma = new PrismaClient();

// Invalida cache de eventos
export async function invalidateEventsCache() {
  if (redis) {
    try {
      await redis.del(['events:popular']);
    } catch (error) {
      console.warn('Erro ao invalidar cache:', error);
    }
  }
}

// Busca eventos do cache
async function getCachedEvents() {
  if (!redis) return null;
  
  try {
    const cached = await redis.get('events:popular');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Erro ao acessar cache Redis:', error);
  }
  return null;
}

// Salva eventos no cache
async function cacheEvents(events: any[]) {
  if (!redis) return;
  
  try {
    await redis.set('events:popular', JSON.stringify(events), 'EX', 60);
  } catch (error) {
    console.warn('Erro ao salvar cache Redis:', error);
  }
}

// Lista eventos com filtros opcionais
export async function getAll({ date, name }: { date?: string; name?: string }) {
  // Usa cache apenas se não houver filtro e Redis estiver disponível
  const cacheKey = !date && !name ? 'events:popular' : undefined;
  if (cacheKey && redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Erro ao acessar cache:', error);
    }
  }
  const where: any = {};
  if (date) {
    const start = new Date(date + "T00:00:00.000Z");
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    where.eventDate = { gte: start, lt: end };
  }
  if (name) where.name = { contains: name, mode: 'insensitive' };
  // Busca eventos ordenados por data
  const events = await prisma.event.findMany({
    where,
    orderBy: { eventDate: 'asc' },
    include: { 
      creator: { select: { id: true, name: true, email: true } }, 
      reservations: { where: { status: 'CONFIRMED' } }
    }
  });
  if (cacheKey && redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(events), { EX: 60 });
    } catch (error) {
      console.warn('Erro ao salvar cache:', error);
    }
  }
  return events;
}

// Busca evento por ID
export async function getById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { 
      creator: { select: { id: true, name: true, email: true } }, 
      reservations: { where: { status: 'CONFIRMED' } }
    }
  });
  if (!event) throw new Error('Evento não encontrado');
  return event;
}

/**
 * Cria um novo evento. Valida campos obrigatórios e capacidade.
 */
export async function create(data: any) {
  if (!data.name || !data.eventDate || !data.maxCapacity) throw new Error('Campos obrigatórios ausentes');
  if (data.maxCapacity <= 0) throw new Error('Capacidade deve ser maior que zero');
  return prisma.event.create({ data });
}

/**
 * Atualiza um evento existente pelo ID.
 */
export async function update(id: string, data: any) {
  return prisma.event.update({ where: { id }, data });
}

/**
 * Remove um evento pelo ID.
 */
export async function remove(id: string) {
  await prisma.event.delete({ where: { id } });
} 