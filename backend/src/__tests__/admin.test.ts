import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../app';

import { Role } from '@prisma/client';

jest.setTimeout(20000);

jest.mock('../utils/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    isOpen: false,
  },
}));

const prisma = new PrismaClient();

describe('Admin User API', () => {
  const admin = {
    email: 'admin@example.com',
    password: 'Admin1234',
    name: 'Admin',
    role: Role.ADMIN,
  };
  const user = {
    email: 'user2@example.com',
    password: 'User1234',
    name: 'User Two',
  };
  let adminToken: string;
  let userId: string;

  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [admin.email, user.email] } },
    });
    await request(app).post('/auth/register').send(admin);
    await prisma.user.update({
      where: { email: admin.email },
      data: { role: Role.ADMIN },
    });
    const login = await request(app)
      .post('/auth/login')
      .send({ email: admin.email, password: admin.password });
    adminToken = login.body.token;
  });

  it('admin pode criar usuário via API', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(user);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', user.email);
    expect(res.body).toHaveProperty('name', user.name);
    expect(res.body).toHaveProperty('role', 'USER');

    userId = res.body.id;
  });

  it('admin pode listar todos os usuários', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('admin pode buscar usuário por id', async () => {
    const res = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', user.email);
  });

  it('admin pode atualizar usuário', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'User Updated' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'User Updated');
  });

  it('admin pode deletar usuário', async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });
});
