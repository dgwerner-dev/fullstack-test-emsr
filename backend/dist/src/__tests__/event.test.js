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
        on: jest.fn(),
        connect: jest.fn(),
        isOpen: false,
    }
}));
const prisma = new client_1.PrismaClient();
describe('Event API', () => {
    const admin = { email: 'eventadmin@example.com', password: 'Admin1234', name: 'Event Admin', role: client_1.Role.ADMIN };
    let adminToken;
    let eventId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.user.deleteMany({ where: { email: admin.email } });
        yield prisma.reservation.deleteMany({});
        yield prisma.event.deleteMany({});
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(admin);
        yield prisma.user.update({ where: { email: admin.email }, data: { role: client_1.Role.ADMIN } });
        const login = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ email: admin.email, password: admin.password });
        adminToken = login.body.token;
    }));
    it('admin pode criar evento', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {
            name: 'Evento Teste',
            eventDate: new Date().toISOString(),
            maxCapacity: 10
        };
        const res = yield (0, supertest_1.default)(app_1.default).post('/events').set('Authorization', `Bearer ${adminToken}`).send(event);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        eventId = res.body.id;
    }));
    it('admin pode listar eventos', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/events').set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
    it('admin pode buscar evento por id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/events/${eventId}`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', eventId);
    }));
    it('admin pode atualizar evento', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).put(`/events/${eventId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Evento Atualizado' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Evento Atualizado');
    }));
    it('admin pode deletar evento', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/events/${eventId}`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(204);
    }));
});
