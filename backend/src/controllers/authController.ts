import { Request, Response } from 'express';
import * as authService from '../services/authService';

/**
 * Controller responsável pelo registro de novos usuários.
 * Retorna erro se o e-mail já estiver cadastrado.
 */
export async function register(req: Request, res: Response) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Controller responsável pelo login de usuários.
 * Retorna JWT se sucesso, erro se credenciais inválidas.
 */
export async function login(req: Request, res: Response) {
  try {
    const token = await authService.login(req.body);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
} 