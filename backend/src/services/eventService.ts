import { PrismaClient } from '@prisma/client';
import { CreateEventData, EventFilters, UpdateEventData } from '../types';
import { cacheService } from './cacheService';

const prisma = new PrismaClient();

// Invalida cache de eventos
export async function invalidateEventsCache() {
  await cacheService.del('events:popular');
}

// Lista eventos com filtros opcionais
export async function getAll({ date, name }: EventFilters) {
  // Usa cache apenas se não houver filtro
  const cacheKey = !date && !name ? 'events:popular' : undefined;
  if (cacheKey) {
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }
  const where: Record<string, any> = {};
  if (date) {
    const start = new Date(date + 'T00:00:00.000Z');
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
      reservations: { where: { status: 'CONFIRMED' } },
    },
  });
  if (cacheKey) {
    await cacheService.set(cacheKey, JSON.stringify(events), 60);
  }
  return events;
}

// Busca evento por ID
export async function getById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      reservations: { where: { status: 'CONFIRMED' } },
    },
  });
  if (!event) throw new Error('Evento não encontrado');
  return event;
}

/**
 * Cria um novo evento. Valida campos obrigatórios e capacidade.
 */
export async function create(data: CreateEventData) {
  if (!data.name || !data.eventDate || !data.maxCapacity)
    throw new Error('Campos obrigatórios ausentes');
  if (data.maxCapacity <= 0)
    throw new Error('Capacidade deve ser maior que zero');
  return prisma.event.create({ data });
}

/**
 * Atualiza um evento existente pelo ID.
 */
export async function update(id: string, data: UpdateEventData) {
  return prisma.event.update({ where: { id }, data });
}

/**
 * Remove um evento pelo ID.
 */
export async function remove(id: string) {
  await prisma.event.delete({ where: { id } });
}
