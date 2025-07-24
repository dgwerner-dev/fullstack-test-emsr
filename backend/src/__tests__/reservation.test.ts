import { PrismaClient, Role } from '@prisma/client';
import request from 'supertest';
import app from '../app';

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

describe('Reservation API', () => {
  const admin = { email: 'resadmin@example.com', password: 'Admin1234', name: 'Res Admin', role: Role.ADMIN };
  const user = { email: 'resuser@example.com', password: 'User1234', name: 'Res User' };
  let adminToken: string;
  let userToken: string;
  let eventId: string;
  let reservationId: string;

  beforeAll(async () => {
    await prisma.reservation.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { in: [admin.email, user.email] } } });
    const adminCreated = await request(app).post('/auth/register').send(admin);
    await prisma.user.update({ where: { email: admin.email }, data: { role: Role.ADMIN } });
    console.log('Admin criado:', adminCreated.body);
    const userRes = await request(app).post('/auth/register').send(user);
    console.log('User register response:', userRes.status, userRes.body);
    const loginAdmin = await request(app).post('/auth/login').send({ email: admin.email, password: admin.password });
    adminToken = loginAdmin.body.token;
    console.log('Admin login:', loginAdmin.status, loginAdmin.body);
    const loginUser = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
    userToken = loginUser.body.token;
    console.log('User login:', loginUser.status, loginUser.body);
    // Criar evento
    const event = {
      name: 'Evento Reserva',
      eventDate: new Date().toISOString(),
      maxCapacity: 2
    };
    const res = await request(app).post('/events').set('Authorization', `Bearer ${adminToken}`).send(event);
    eventId = res.body.id;
    console.log('Evento criado:', res.status, res.body);
  });

  it('usuário pode reservar vaga em evento', async () => {
    const res = await request(app).post(`/reservations/events/${eventId}/reserve`).set('Authorization', `Bearer ${userToken}`);
    console.log('Reserva response:', res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    reservationId = res.body.id;
  });

  it('usuário pode listar suas reservas', async () => {
    const res = await request(app).get('/reservations/my-reservations').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('admin pode listar reservas de um evento', async () => {
    const res = await request(app).get(`/reservations/events/${eventId}/reservations`).set('Authorization', `Bearer ${adminToken}`);
    console.log('Listar reservas (admin):', res.status, res.body);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('usuário pode cancelar sua reserva', async () => {
    const res = await request(app).delete(`/reservations/${reservationId}`).set('Authorization', `Bearer ${userToken}`);
    console.log('Cancelar reserva:', res.status, res.body);
    expect(res.status).toBe(204);
  });

  it('não permite reservar vaga em evento lotado', async () => {
    // Criar evento isolado para o teste
    const event = {
      name: 'Evento Lotado',
      eventDate: new Date().toISOString(),
      maxCapacity: 2
    };
    const eventRes = await request(app).post('/events').set('Authorization', `Bearer ${adminToken}`).send(event);
    const lotadoId = eventRes.body.id;
    // Reservar com dois usuários
    const user2 = { email: 'resuser2@example.com', password: 'User1234', name: 'Res User 2' };
    await request(app).post('/auth/register').send(user2);
    const loginUser2 = await request(app).post('/auth/login').send({ email: user2.email, password: user2.password });
    const user2Token = loginUser2.body.token;
    await request(app).post(`/reservations/events/${lotadoId}/reserve`).set('Authorization', `Bearer ${userToken}`);
    await request(app).post(`/reservations/events/${lotadoId}/reserve`).set('Authorization', `Bearer ${user2Token}`);
    // Tentar reservar com um terceiro usuário
    const user3 = { email: 'resuser3@example.com', password: 'User1234', name: 'Res User 3' };
    await request(app).post('/auth/register').send(user3);
    const loginUser3 = await request(app).post('/auth/login').send({ email: user3.email, password: user3.password });
    const user3Token = loginUser3.body.token;
    const res = await request(app).post(`/reservations/events/${lotadoId}/reserve`).set('Authorization', `Bearer ${user3Token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
