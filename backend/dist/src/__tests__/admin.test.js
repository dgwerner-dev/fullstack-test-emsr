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
describe('Admin User API', () => {
    const admin = { email: 'admin@example.com', password: 'Admin1234', name: 'Admin', role: client_1.Role.ADMIN };
    const user = { email: 'user2@example.com', password: 'User1234', name: 'User Two' };
    let adminToken;
    let userId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.user.deleteMany({ where: { email: { in: [admin.email, user.email] } } });
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(admin);
        yield prisma.user.update({ where: { email: admin.email }, data: { role: client_1.Role.ADMIN } });
        const login = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ email: admin.email, password: admin.password });
        adminToken = login.body.token;
    }));
    it('admin pode criar usuário', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield prisma.user.create({ data: Object.assign({}, user) });
        userId = res.id;
        expect(res).toHaveProperty('id');
        expect(res).toHaveProperty('email', user.email);
    }));
    it('admin pode listar todos os usuários', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/users').set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
    it('admin pode buscar usuário por id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/users/${userId}`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('email', user.email);
    }));
    it('admin pode atualizar usuário', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).put(`/users/${userId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'User Updated' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'User Updated');
    }));
    it('admin pode deletar usuário', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/users/${userId}`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(204);
    }));
});
