import { Request, Response } from 'express';
import * as reservationService from '../services/reservationService';
import { AuthenticatedRequest } from '../types';

/**
 * Realiza uma reserva para o usuário autenticado em um evento.
 */
export async function reserveSpot(req: Request, res: Response) {
  try {
    const reservation = await reservationService.reserve({
      eventId: req.params.id,
      userId: (req as AuthenticatedRequest).userId,
    });
    res.status(201).json(reservation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Cancela uma reserva (usuário ou admin).
 */
export async function cancelReservation(req: Request, res: Response) {
  try {
    await reservationService.cancel({
      reservationId: req.params.id,
      userId: (req as AuthenticatedRequest).userId,
      isAdmin: (req as AuthenticatedRequest).role === 'ADMIN',
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Lista todas as reservas do usuário autenticado.
 */
export async function getMyReservations(req: Request, res: Response) {
  const reservations = await reservationService.getByUser((req as AuthenticatedRequest).userId);
  res.json(reservations);
}

/**
 * Lista todas as reservas de um evento (admin).
 */
export async function getEventReservations(req: Request, res: Response) {
  const reservations = await reservationService.getByEvent(req.params.id);
  res.json(reservations);
}
