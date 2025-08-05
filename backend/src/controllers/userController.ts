import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { AuthenticatedRequest } from '../types';

// Retorna perfil do usuário
export async function getProfile(req: Request, res: Response) {
  try {
    const user = await userService.getById((req as AuthenticatedRequest).userId);
    res.json(user);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(404).json({ error: errorMessage });
  }
}

// Atualiza perfil do usuário
export async function updateProfile(req: Request, res: Response) {
  try {
    const user = await userService.updateById((req as AuthenticatedRequest).userId, req.body);
    res.json(user);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(400).json({ error: errorMessage });
  }
}

// Deleta perfil do usuário
export async function deleteProfile(req: Request, res: Response) {
  try {
    await userService.deleteById((req as AuthenticatedRequest).userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// Admin: lista todos os usuários
export async function getAllUsers(req: Request, res: Response) {
  const users = await userService.getAll();
  res.json(users);
}

// Admin: busca usuário por ID
export async function getUserById(req: Request, res: Response) {
  try {
    const user = await userService.getById(req.params.id);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

// Admin: atualiza usuário
export async function updateUserById(req: Request, res: Response) {
  try {
    const user = await userService.updateById(req.params.id, req.body);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// Admin: deleta usuário
export async function deleteUserById(req: Request, res: Response) {
  try {
    await userService.deleteById(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
