import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = verifyToken(token) as any;
    (req as any).userId = payload.userId;
    (req as any).role = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).role;
    if (!roles.includes(role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
} 