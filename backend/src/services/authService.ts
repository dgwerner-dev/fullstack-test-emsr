import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

/**
 * Registra um novo usuário, garantindo e-mail único e senha protegida por hash.
 */
export async function register({ email, password, name }: { email: string; password: string; name: string }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email já cadastrado');
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
    select: { id: true, email: true, name: true, role: true }
  });
  return user;
}

/**
 * Realiza login, validando senha e retornando JWT se sucesso.
 */
export async function login({ email, password }: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Usuário ou senha inválidos');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Usuário ou senha inválidos');
  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
  return token;
} 