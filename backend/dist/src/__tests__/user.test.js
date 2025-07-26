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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
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
    let token;
    let userId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send(user);
        userId = res.body.id;
        const login = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ email: user.email, password: user.password });
        token = login.body.token;
    }), 10000);
    it('deve obter o próprio perfil', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/users/me').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('email', user.email);
    }), 10000);
    it('deve atualizar o próprio nome', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).put('/users/me').set('Authorization', `Bearer ${token}`).send({ name: 'Novo Nome' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Novo Nome');
    }), 10000);
    it('deve deletar o próprio perfil', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).delete('/users/me').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(204);
    }), 10000);
});
