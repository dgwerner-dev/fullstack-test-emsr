import { Request, Response } from 'express';
import * as eventService from '../services/eventService';
import { AuthenticatedRequest } from '../types';

/**
 * Lista eventos, com filtros opcionais de data e nome.
 */
export async function getAllEvents(req: Request, res: Response) {
  const { date, name } = req.query;
  const events = await eventService.getAll({
    date: date as string,
    name: name as string,
  });
  res.json(events);
}

/**
 * Busca detalhes de um evento pelo ID.
 */
export async function getEventById(req: Request, res: Response) {
  try {
    const event = await eventService.getById(req.params.id);
    res.json(event);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(404).json({ error: errorMessage });
  }
}

/**
 * Cria um novo evento (admin).
 */
export async function createEvent(req: Request, res: Response) {
  try {
          const event = await eventService.create({
        ...req.body,
        creatorId: (req as AuthenticatedRequest).userId,
      });
    res.status(201).json(event);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(400).json({ error: errorMessage });
  }
}

/**
 * Atualiza um evento existente (admin).
 */
export async function updateEvent(req: Request, res: Response) {
  try {
    const event = await eventService.update(req.params.id, req.body);
    res.json(event);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(400).json({ error: errorMessage });
  }
}

/**
 * Deleta um evento (admin).
 */
export async function deleteEvent(req: Request, res: Response) {
  try {
    await eventService.remove(req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(400).json({ error: errorMessage });
  }
}
