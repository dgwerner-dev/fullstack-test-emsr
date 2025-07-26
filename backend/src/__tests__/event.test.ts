import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../app';

const Role = {
  USER: 'USER' as const,
  ADMIN: 'ADMIN' as const
};

jest.setTimeout(20000);

jest.mock('../utils/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    isOpen: false,
  }
}));

const prisma = new PrismaClient();

describe('Event API', () => {
  const admin = { email: 'eventadmin@example.com', password: 'Admin1234', name: 'Event Admin', role: Role.ADMIN };
  let adminToken: string;
  let eventId: string;

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: admin.email } });
    await prisma.reservation.deleteMany({});
    await prisma.event.deleteMany({});
    await request(app).post('/auth/register').send(admin);
    await prisma.user.update({ where: { email: admin.email }, data: { role: Role.ADMIN } });
    const login = await request(app).post('/auth/login').send({ email: admin.email, password: admin.password });
    adminToken = login.body.token;
  });

  it('admin pode criar evento', async () => {
    const event = {
      name: 'Evento Teste',
      eventDate: new Date().toISOString(),
      maxCapacity: 10
    };
    const res = await request(app).post('/events').set('Authorization', `Bearer ${adminToken}`).send(event);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    eventId = res.body.id;
  });

  it('admin pode listar eventos', async () => {
    const res = await request(app).get('/events').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('admin pode buscar evento por id', async () => {
    const res = await request(app).get(`/events/${eventId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', eventId);
  });

  it('admin pode atualizar evento', async () => {
    const res = await request(app).put(`/events/${eventId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Evento Atualizado' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Evento Atualizado');
  });

  it('admin pode deletar evento', async () => {
    const res = await request(app).delete(`/events/${eventId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });
});
