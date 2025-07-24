import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  const user = { email: 'testuser@example.com', password: 'Test1234', name: 'Test User' };
  let token: string;

  it('deve registrar um novo usuário', async () => {
    const res = await request(app).post('/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', user.email);
  });

  it('deve fazer login com usuário registrado', async () => {
    const res = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('não deve registrar usuário com email já existente', async () => {
    const res = await request(app).post('/auth/register').send(user);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('não deve logar com senha errada', async () => {
    const res = await request(app).post('/auth/login').send({ email: user.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
}); 