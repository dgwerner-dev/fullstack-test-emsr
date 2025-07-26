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
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateEventsCache = invalidateEventsCache;
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const client_1 = require("@prisma/client");
const redis_1 = require("../utils/redis");
const prisma = new client_1.PrismaClient();
// Invalida cache de eventos
function invalidateEventsCache() {
    return __awaiter(this, void 0, void 0, function* () {
        if (redis_1.redis) {
            try {
                yield redis_1.redis.del(['events:popular']);
            }
            catch (error) {
                console.warn('Erro ao invalidar cache:', error);
            }
        }
    });
}
// Busca eventos do cache
function getCachedEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!redis_1.redis)
            return null;
        try {
            const cached = yield redis_1.redis.get('events:popular');
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (error) {
            console.warn('Erro ao acessar cache Redis:', error);
        }
        return null;
    });
}
// Salva eventos no cache
function cacheEvents(events) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!redis_1.redis)
            return;
        try {
            yield redis_1.redis.set('events:popular', JSON.stringify(events), 'EX', 60);
        }
        catch (error) {
            console.warn('Erro ao salvar cache Redis:', error);
        }
    });
}
// Lista eventos com filtros opcionais
function getAll(_a) {
    return __awaiter(this, arguments, void 0, function* ({ date, name }) {
        // Usa cache apenas se não houver filtro e Redis estiver disponível
        const cacheKey = !date && !name ? 'events:popular' : undefined;
        if (cacheKey && redis_1.redis) {
            try {
                const cached = yield redis_1.redis.get(cacheKey);
                if (cached) {
                    return JSON.parse(cached);
                }
            }
            catch (error) {
                console.warn('Erro ao acessar cache:', error);
            }
        }
        const where = {};
        if (date) {
            const start = new Date(date + "T00:00:00.000Z");
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            where.eventDate = { gte: start, lt: end };
        }
        if (name)
            where.name = { contains: name, mode: 'insensitive' };
        // Busca eventos ordenados por data
        const events = yield prisma.event.findMany({
            where,
            orderBy: { eventDate: 'asc' },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                reservations: { where: { status: 'CONFIRMED' } }
            }
        });
        if (cacheKey && redis_1.redis) {
            try {
                yield redis_1.redis.set(cacheKey, JSON.stringify(events), { EX: 60 });
            }
            catch (error) {
                console.warn('Erro ao salvar cache:', error);
            }
        }
        return events;
    });
}
// Busca evento por ID
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const event = yield prisma.event.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                reservations: { where: { status: 'CONFIRMED' } }
            }
        });
        if (!event)
            throw new Error('Evento não encontrado');
        return event;
    });
}
/**
 * Cria um novo evento. Valida campos obrigatórios e capacidade.
 */
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data.name || !data.eventDate || !data.maxCapacity)
            throw new Error('Campos obrigatórios ausentes');
        if (data.maxCapacity <= 0)
            throw new Error('Capacidade deve ser maior que zero');
        return prisma.event.create({ data });
    });
}
/**
 * Atualiza um evento existente pelo ID.
 */
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.event.update({ where: { id }, data });
    });
}
/**
 * Remove um evento pelo ID.
 */
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.event.delete({ where: { id } });
    });
}
