import { PrismaClient } from '@prisma/client';
import { getIO } from '../utils/socket';
import { invalidateEventsCache } from './eventService';

const prisma = new PrismaClient();

export async function reserve({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) {
  return prisma.$transaction(async tx => {
    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error('Evento não encontrado');

    const reserved = await tx.reservation.count({
      where: { eventId, status: 'CONFIRMED' },
    });
    if (reserved >= event.maxCapacity) throw new Error('Evento esgotado');

    const already = await tx.reservation.findFirst({
      where: { eventId, userId, status: 'CONFIRMED' },
    });
    if (already) throw new Error('Você já reservou este evento');

    const reservation = await tx.reservation.create({
      data: { eventId, userId },
    });

    const totalAfter = await tx.reservation.count({
      where: { eventId, status: 'CONFIRMED' },
    });
    if (totalAfter >= event.maxCapacity) {
      getIO().emit('event_sold_out', { eventId, eventName: event.name });
    }
    getIO().emit('reservation_confirmed', {
      eventId,
      eventName: event.name,
      userId,
      reservationId: reservation.id,
    });

    await invalidateEventsCache();

    return reservation;
  });
}

export async function cancel({
  reservationId,
  userId,
  isAdmin,
}: {
  reservationId: string;
  userId: string;
  isAdmin: boolean;
}) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { event: { select: { id: true, name: true } } },
  });

  if (!reservation) throw new Error('Reserva não encontrada');
  if (!isAdmin && reservation.userId !== userId)
    throw new Error('Acesso negado');

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'CANCELED' },
  });

  getIO().emit('reservation_cancelled', {
    eventId: reservation.eventId,
    eventName: reservation.event.name,
    userId,
    reservationId,
  });

  await invalidateEventsCache();
}

export async function getByUser(userId: string) {
  return prisma.reservation.findMany({
    where: { userId },
    include: { event: true },
  });
}

export async function getByEvent(eventId: string) {
  return prisma.reservation.findMany({
    where: { eventId },
    include: { user: true },
  });
}
