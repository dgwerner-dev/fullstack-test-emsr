import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Lista todos os usuários
export async function getAll() {
  return prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
}

// Busca usuário por ID
export async function getById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  if (!user) throw new Error('Usuário não encontrado');
  return user;
}

// Atualiza dados do usuário
export async function updateById(
  id: string,
  data: { name?: string; password?: string }
) {
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  return user;
}

// Remove usuário
export async function deleteById(id: string) {
  await prisma.user.delete({ where: { id } });
}
