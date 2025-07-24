import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Realiza uma reserva para um evento, respeitando o limite de capacidade e impedindo reservas duplicadas.
 * Lança erro se o evento não existir, estiver lotado ou o usuário já tiver reserva confirmada.
 */
export async function reserve({ eventId, userId }: { eventId: string; userId: string }) {
  return prisma.$transaction(async (tx) => {
    // Busca o evento pelo ID
    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error('Evento não encontrado');
    // Conta quantas reservas confirmadas já existem para o evento
    const reserved = await tx.reservation.count({ where: { eventId, status: 'CONFIRMED' } });
    // Se já atingiu a capacidade máxima, não permite nova reserva
    if (reserved >= event.maxCapacity) throw new Error('Evento esgotado');
    // Impede que o mesmo usuário reserve mais de uma vez
    const already = await tx.reservation.findFirst({ where: { eventId, userId, status: 'CONFIRMED' } });
    if (already) throw new Error('Você já reservou este evento');
    // Cria a reserva com status confirmado
    const reservation = await tx.reservation.create({ data: { eventId, userId } });
    return reservation;
  });
}

/**
 * Cancela uma reserva, permitindo que o usuário cancele a própria ou o admin cancele qualquer uma.
 * Lança erro se a reserva não existir ou o usuário não tiver permissão.
 */
export async function cancel({ reservationId, userId, role }: { reservationId: string; userId: string; role: string }) {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) throw new Error('Reserva não encontrada');
  if (role !== 'ADMIN' && reservation.userId !== userId) throw new Error('Acesso negado');
  await prisma.reservation.update({ where: { id: reservationId }, data: { status: 'CANCELED' } });
}

/**
 * Lista todas as reservas feitas por um usuário, incluindo detalhes do evento.
 */
export async function getByUser(userId: string) {
  return prisma.reservation.findMany({ where: { userId }, include: { event: true } });
}

/**
 * Lista todas as reservas de um evento, incluindo detalhes do usuário.
 */
export async function getByEvent(eventId: string) {
  return prisma.reservation.findMany({ where: { eventId }, include: { user: true } });
} 