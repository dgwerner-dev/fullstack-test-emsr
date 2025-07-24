import { PrismaClient } from '@prisma/client';
import { redis } from '../utils/redis';

const prisma = new PrismaClient();

/**
 * Lista eventos, podendo filtrar por data e nome. Usa cache Redis para eventos populares.
 */
export async function getAll({ date, name }: { date?: string; name?: string }) {
  // Usa cache apenas se não houver filtro
  const cacheKey = !date && !name ? 'events:popular' : undefined;
  if (cacheKey) {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }
  const where: any = {};
  if (date) where.eventDate = date;
  if (name) where.name = { contains: name, mode: 'insensitive' };
  // Busca eventos ordenados por data
  const events = await prisma.event.findMany({
    where,
    orderBy: { eventDate: 'asc' },
    include: { creator: { select: { id: true, name: true, email: true } }, reservations: true }
  });
  if (cacheKey) await redis.set(cacheKey, JSON.stringify(events), { EX: 60 });
  return events;
}

/**
 * Busca detalhes de um evento pelo ID, incluindo criador e reservas.
 */
export async function getById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { creator: { select: { id: true, name: true, email: true } }, reservations: true }
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