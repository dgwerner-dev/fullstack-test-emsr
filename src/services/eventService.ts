import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAll({ date, name }: { date?: string; name?: string }) {
  const where: any = {};
  if (date) where.eventDate = date;
  if (name) where.name = { contains: name, mode: 'insensitive' };
  return prisma.event.findMany({
    where,
    orderBy: { eventDate: 'asc' },
    include: { creator: { select: { id: true, name: true, email: true } }, reservations: true }
  });
}

export async function getById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { creator: { select: { id: true, name: true, email: true } }, reservations: true }
  });
  if (!event) throw new Error('Evento não encontrado');
  return event;
}

export async function create(data: any) {
  if (!data.name || !data.eventDate || !data.maxCapacity) throw new Error('Campos obrigatórios ausentes');
  if (data.maxCapacity <= 0) throw new Error('Capacidade deve ser maior que zero');
  return prisma.event.create({ data });
}

export async function update(id: string, data: any) {
  return prisma.event.update({ where: { id }, data });
}

export async function remove(id: string) {
  await prisma.event.delete({ where: { id } });
} 