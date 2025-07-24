import { Request, Response } from 'express';
import * as eventService from '../services/eventService';

/**
 * Lista eventos, com filtros opcionais de data e nome.
 */
export async function getAllEvents(req: Request, res: Response) {
  const { date, name } = req.query;
  const events = await eventService.getAll({ date: date as string, name: name as string });
  res.json(events);
}

/**
 * Busca detalhes de um evento pelo ID.
 */
export async function getEventById(req: Request, res: Response) {
  try {
    const event = await eventService.getById(req.params.id);
    res.json(event);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

/**
 * Cria um novo evento (admin).
 */
export async function createEvent(req: Request, res: Response) {
  try {
    const event = await eventService.create({ ...req.body, creatorId: (req as any).userId });
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Atualiza um evento existente (admin).
 */
export async function updateEvent(req: Request, res: Response) {
  try {
    const event = await eventService.update(req.params.id, req.body);
    res.json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Deleta um evento (admin).
 */
export async function deleteEvent(req: Request, res: Response) {
  try {
    await eventService.remove(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
} 