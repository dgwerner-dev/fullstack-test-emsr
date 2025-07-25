import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

/**
 * Middleware que valida o JWT e adiciona userId e role ao request.
 */
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

/**
 * Middleware que restringe acesso a determinadas roles (ex: ADMIN).
 */
export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).role;
    if (!roles.includes(role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
} 