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
exports.getAll = getAll;
exports.getById = getById;
exports.updateById = updateById;
exports.deleteById = deleteById;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// Lista todos os usuários
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
    });
}
// Busca usuário por ID
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
        if (!user)
            throw new Error('Usuário não encontrado');
        return user;
    });
}
// Atualiza dados do usuário
function updateById(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateData = {};
        if (data.name)
            updateData.name = data.name;
        if (data.password)
            updateData.password = yield bcryptjs_1.default.hash(data.password, 10);
        const user = yield prisma.user.update({ where: { id }, data: updateData, select: { id: true, email: true, name: true, role: true, createdAt: true } });
        return user;
    });
}
// Remove usuário
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.user.delete({ where: { id } });
    });
}
