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
exports.reserve = reserve;
exports.cancel = cancel;
exports.getByUser = getByUser;
exports.getByEvent = getByEvent;
const client_1 = require("@prisma/client");
const socket_1 = require("../utils/socket");
const eventService_1 = require("./eventService");
const prisma = new client_1.PrismaClient();
function reserve(_a) {
    return __awaiter(this, arguments, void 0, function* ({ eventId, userId }) {
        return prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const event = yield tx.event.findUnique({ where: { id: eventId } });
            if (!event)
                throw new Error('Evento não encontrado');
            const reserved = yield tx.reservation.count({ where: { eventId, status: 'CONFIRMED' } });
            if (reserved >= event.maxCapacity)
                throw new Error('Evento esgotado');
            const already = yield tx.reservation.findFirst({ where: { eventId, userId, status: 'CONFIRMED' } });
            if (already)
                throw new Error('Você já reservou este evento');
            const reservation = yield tx.reservation.create({ data: { eventId, userId } });
            const totalAfter = yield tx.reservation.count({ where: { eventId, status: 'CONFIRMED' } });
            if (totalAfter >= event.maxCapacity) {
                (0, socket_1.getIO)().emit("event_sold_out", { eventId, eventName: event.name });
            }
            (0, socket_1.getIO)().emit("reservation_confirmed", { eventId, eventName: event.name, userId, reservationId: reservation.id });
            yield (0, eventService_1.invalidateEventsCache)();
            return reservation;
        }));
    });
}
function cancel(_a) {
    return __awaiter(this, arguments, void 0, function* ({ reservationId, userId, isAdmin }) {
        const reservation = yield prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { event: { select: { id: true, name: true } } }
        });
        if (!reservation)
            throw new Error('Reserva não encontrada');
        if (!isAdmin && reservation.userId !== userId)
            throw new Error('Acesso negado');
        yield prisma.reservation.update({ where: { id: reservationId }, data: { status: 'CANCELED' } });
        (0, socket_1.getIO)().emit("reservation_cancelled", {
            eventId: reservation.eventId,
            eventName: reservation.event.name,
            userId,
            reservationId
        });
        yield (0, eventService_1.invalidateEventsCache)();
    });
}
function getByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.reservation.findMany({ where: { userId }, include: { event: true } });
    });
}
function getByEvent(eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.reservation.findMany({ where: { eventId }, include: { user: true } });
    });
}
