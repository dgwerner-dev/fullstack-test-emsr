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
describe('Auth API', () => {
    const user = { email: 'testuser@example.com', password: 'Test1234', name: 'Test User' };
    let token;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.user.deleteMany({ where: { email: user.email } });
    }));
    it('deve registrar um novo usuário', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email', user.email);
    }));
    it('deve fazer login com usuário registrado', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ email: user.email, password: user.password });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    }));
    it('não deve registrar usuário com email já existente', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    }));
    it('não deve logar com senha errada', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ email: user.email, password: 'wrongpass' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    }));
});
