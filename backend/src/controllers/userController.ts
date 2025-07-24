import { Request, Response } from 'express';
import * as userService from '../services/userService';

export async function getProfile(req: Request, res: Response) {
  try {
    const user = await userService.getById((req as any).userId);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const user = await userService.updateById((req as any).userId, req.body);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteProfile(req: Request, res: Response) {
  try {
    await userService.deleteById((req as any).userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// Admin
export async function getAllUsers(req: Request, res: Response) {
  const users = await userService.getAll();
  res.json(users);
}

export async function getUserById(req: Request, res: Response) {
  try {
    const user = await userService.getById(req.params.id);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

export async function updateUserById(req: Request, res: Response) {
  try {
    const user = await userService.updateById(req.params.id, req.body);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteUserById(req: Request, res: Response) {
  try {
    await userService.deleteById(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
} 