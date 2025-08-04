import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../app';

const Role = {
  USER: 'USER' as const,
  ADMIN: 'ADMIN' as const,
};

jest.setTimeout(20000);

jest.mock('../utils/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    isOpen: false,
  },
}));

const prisma = new PrismaClient();

describe('Reservation API', () => {
  const admin = {
    email: 'resadmin@example.com',
    password: 'Admin1234',
    name: 'Res Admin',
    role: Role.ADMIN,
  };
  const user = {
    email: 'resuser@example.com',
    password: 'User1234',
    name: 'Res User',
  };
  let adminToken: string;
  let userToken: string;
  let eventId: string;
  let reservationId: string;

  beforeAll(async () => {
    await prisma.reservation.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: { in: [admin.email, user.email] } },
    });

    // Criar admin primeiro
    const adminCreated = await request(app).post('/auth/register').send(admin);

    // Atualizar role para ADMIN
    await prisma.user.update({
      where: { email: admin.email },
      data: { role: Role.ADMIN },
    });

    // Criar usuário
    const userRes = await request(app).post('/auth/register').send(user);

    // Fazer login
    const loginAdmin = await request(app)
      .post('/auth/login')
      .send({ email: admin.email, password: admin.password });
    adminToken = loginAdmin.body.token;

    const loginUser = await request(app)
      .post('/auth/login')
      .send({ email: user.email, password: user.password });
    userToken = loginUser.body.token;

    // Criar evento
    const event = {
      name: 'Evento Reserva',
      eventDate: new Date().toISOString(),
      maxCapacity: 2,
    };
    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(event);
    eventId = res.body.id;
  });

  afterAll(async () => {
    await prisma.reservation.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: { in: [admin.email, user.email] } },
    });
    await prisma.$disconnect();
  });

  it('usuário pode reservar vaga em evento', async () => {
    // Verificar se o evento existe
    const eventCheck = await request(app).get(`/events/${eventId}`);

    const res = await request(app)
      .post(`/reservations/events/${eventId}/reserve`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    reservationId = res.body.id;
  });

  it('usuário pode listar suas reservas', async () => {
    const res = await request(app)
      .get('/reservations/my-reservations')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('admin pode listar reservas de um evento', async () => {
    const res = await request(app)
      .get(`/reservations/events/${eventId}/reservations`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('usuário pode cancelar sua reserva', async () => {
    // Criar um usuário diferente para este teste
    const user2 = {
      email: 'resuser2@example.com',
      password: 'User1234',
      name: 'Res User 2',
    };
    await request(app).post('/auth/register').send(user2);
    const loginUser2 = await request(app)
      .post('/auth/login')
      .send({ email: user2.email, password: user2.password });
    const user2Token = loginUser2.body.token;

    // Criar uma nova reserva específica para este teste
    const resCreate = await request(app)
      .post(`/reservations/events/${eventId}/reserve`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(resCreate.status).toBe(201);
    const newReservationId = resCreate.body.id;

    const res = await request(app)
      .delete(`/reservations/${newReservationId}`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res.status).toBe(204);
  });

  it('não permite reservar vaga em evento lotado', async () => {
    // Criar evento isolado para o teste
    const event = {
      name: 'Evento Lotado',
      eventDate: new Date().toISOString(),
      maxCapacity: 2,
    };
    const eventRes = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(event);
    const lotadoId = eventRes.body.id;

    // Reservar com dois usuários
    const user2 = {
      email: 'resuser2@example.com',
      password: 'User1234',
      name: 'Res User 2',
    };
    await request(app).post('/auth/register').send(user2);
    const loginUser2 = await request(app)
      .post('/auth/login')
      .send({ email: user2.email, password: user2.password });
    const user2Token = loginUser2.body.token;

    await request(app)
      .post(`/reservations/events/${lotadoId}/reserve`)
      .set('Authorization', `Bearer ${userToken}`);
    await request(app)
      .post(`/reservations/events/${lotadoId}/reserve`)
      .set('Authorization', `Bearer ${user2Token}`);

    // Tentar reservar com um terceiro usuário
    const user3 = {
      email: 'resuser3@example.com',
      password: 'User1234',
      name: 'Res User 3',
    };
    await request(app).post('/auth/register').send(user3);
    const loginUser3 = await request(app)
      .post('/auth/login')
      .send({ email: user3.email, password: user3.password });
    const user3Token = loginUser3.body.token;

    const res = await request(app)
      .post(`/reservations/events/${lotadoId}/reserve`)
      .set('Authorization', `Bearer ${user3Token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
