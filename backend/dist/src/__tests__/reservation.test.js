"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
jest.setTimeout(20000);
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
const prisma = new client_1.PrismaClient();
describe('Reservation API', () => {
    const admin = { email: 'resadmin@example.com', password: 'Admin1234', name: 'Res Admin', role: client_1.Role.ADMIN };
    const user = { email: 'resuser@example.com', password: 'User1234', name: 'Res User' };
    let adminToken;
    let userToken;
    let eventId;
    let reservationId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.reservation.deleteMany({});
        yield prisma.event.deleteMany({});
        yield prisma.user.deleteMany({ where: { email: { in: [admin.email, user.email] } } });
        // Criar admin primeiro
        const adminCreated = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(admin);
        // Atualizar role para ADMIN
        yield prisma.user.update({ where: { email: admin.email }, data: { role: client_1.Role.ADMIN } });
        // Criar usuário
        const userRes = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        // Fazer login
        const loginAdmin = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ email: admin.email, password: admin.password });
        adminToken = loginAdmin.body.token;
        const loginUser = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ email: user.email, password: user.password });
        userToken = loginUser.body.token;
        // Criar evento
        const event = {
            name: 'Evento Reserva',
            eventDate: new Date().toISOString(),
            maxCapacity: 2
        };
        const res = yield (0, supertest_1.default)(app_1.default).post('/events').set('Authorization', `Bearer ${adminToken}`).send(event);
        eventId = res.body.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.reservation.deleteMany({});
        yield prisma.event.deleteMany({});
        yield prisma.user.deleteMany({ where: { email: { in: [admin.email, user.email] } } });
        yield prisma.$disconnect();
    }));
    it('usuário pode reservar vaga em evento', () => __awaiter(void 0, void 0, void 0, function* () {
        // Verificar se o evento existe
        const eventCheck = yield (0, supertest_1.default)(app_1.default).get(`/events/${eventId}`);
        const res = yield (0, supertest_1.default)(app_1.default).post(`/reservations/events/${eventId}/reserve`).set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        reservationId = res.body.id;
    }));
    it('usuário pode listar suas reservas', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/reservations/my-reservations').set('Authorization', `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
    it('admin pode listar reservas de um evento', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/reservations/events/${eventId}/reservations`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
    it('usuário pode cancelar sua reserva', () => __awaiter(void 0, void 0, void 0, function* () {
        // Criar um usuário diferente para este teste
        const user2 = { email: 'resuser2@example.com', password: 'User1234', name: 'Res User 2' };
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user2);
        const loginUser2 = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ email: user2.email, password: user2.password });
        const user2Token = loginUser2.body.token;
        // Criar uma nova reserva específica para este teste
        const resCreate = yield (0, supertest_1.default)(app_1.default).post(`/reservations/events/${eventId}/reserve`).set('Authorization', `Bearer ${user2Token}`);
        expect(resCreate.status).toBe(201);
        const newReservationId = resCreate.body.id;
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/reservations/${newReservationId}`).set('Authorization', `Bearer ${user2Token}`);
        expect(res.status).toBe(204);
    }));
    it('não permite reservar vaga em evento lotado', () => __awaiter(void 0, void 0, void 0, function* () {
        // Criar evento isolado para o teste
        const event = {
            name: 'Evento Lotado',
            eventDate: new Date().toISOString(),
            maxCapacity: 2
        };
        const eventRes = yield (0, supertest_1.default)(app_1.default).post('/events').set('Authorization', `Bearer ${adminToken}`).send(event);
        const lotadoId = eventRes.body.id;
        // Reservar com dois usuários
        const user2 = { email: 'resuser2@example.com', password: 'User1234', name: 'Res User 2' };
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user2);
        const loginUser2 = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ email: user2.email, password: user2.password });
        const user2Token = loginUser2.body.token;
        yield (0, supertest_1.default)(app_1.default).post(`/reservations/events/${lotadoId}/reserve`).set('Authorization', `Bearer ${userToken}`);
        yield (0, supertest_1.default)(app_1.default).post(`/reservations/events/${lotadoId}/reserve`).set('Authorization', `Bearer ${user2Token}`);
        // Tentar reservar com um terceiro usuário
        const user3 = { email: 'resuser3@example.com', password: 'User1234', name: 'Res User 3' };
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user3);
        const loginUser3 = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ email: user3.email, password: user3.password });
        const user3Token = loginUser3.body.token;
        const res = yield (0, supertest_1.default)(app_1.default).post(`/reservations/events/${lotadoId}/reserve`).set('Authorization', `Bearer ${user3Token}`);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    }));
});
