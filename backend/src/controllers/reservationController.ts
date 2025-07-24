import { Request, Response } from 'express';
import * as reservationService from '../services/reservationService';

export async function reserveSpot(req: Request, res: Response) {
  try {
    const reservation = await reservationService.reserve({ eventId: req.params.id, userId: (req as any).userId });
    res.status(201).json(reservation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function cancelReservation(req: Request, res: Response) {
  try {
    await reservationService.cancel({ reservationId: req.params.id, userId: (req as any).userId, role: (req as any).role });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getMyReservations(req: Request, res: Response) {
  const reservations = await reservationService.getByUser((req as any).userId);
  res.json(reservations);
}

export async function getEventReservations(req: Request, res: Response) {
  const reservations = await reservationService.getByEvent(req.params.id);
  res.json(reservations);
} 