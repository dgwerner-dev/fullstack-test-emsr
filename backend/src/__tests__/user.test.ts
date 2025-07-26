import request from 'supertest';
import app from '../app';

jest.mock('../utils/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    isOpen: false,
  }
}));

describe('User API', () => {
  const user = { email: 'user1@example.com', password: 'User1234', name: 'User One' };
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const res = await request(app).post('/auth/register').send(user);
    userId = res.body.id;
    const login = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
    token = login.body.token;
  }, 10000);

  it('deve obter o próprio perfil', async () => {
    const res = await request(app).get('/users/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', user.email);
  }, 10000);

  it('deve atualizar o próprio nome', async () => {
    const res = await request(app).put('/users/me').set('Authorization', `Bearer ${token}`).send({ name: 'Novo Nome' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Novo Nome');
  }, 10000);

  it('deve deletar o próprio perfil', async () => {
    const res = await request(app).delete('/users/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  }, 10000);
});
