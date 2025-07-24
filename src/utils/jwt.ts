import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function decodeToken(token: string) {
  return jwt.decode(token);
} 