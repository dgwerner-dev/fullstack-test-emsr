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
exports.register = register;
exports.login = login;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
/**
 * Registra um novo usuário, garantindo e-mail único e senha protegida por hash.
 */
function register(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, password, name }) {
        const existing = yield prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new Error('Email já cadastrado');
        const hashed = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: { email, password: hashed, name },
            select: { id: true, email: true, name: true, role: true }
        });
        return user;
    });
}
/**
 * Realiza login, validando senha e retornando JWT se sucesso.
 */
function login(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, password }) {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error('Usuário ou senha inválidos');
        const valid = yield bcryptjs_1.default.compare(password, user.password);
        if (!valid)
            throw new Error('Usuário ou senha inválidos');
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
        return token;
    });
}
