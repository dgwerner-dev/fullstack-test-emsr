"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getAllEvents = getAllEvents;
exports.getEventById = getEventById;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
const eventService = __importStar(require("../services/eventService"));
/**
 * Lista eventos, com filtros opcionais de data e nome.
 */
function getAllEvents(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { date, name } = req.query;
        const events = yield eventService.getAll({ date: date, name: name });
        res.json(events);
    });
}
/**
 * Busca detalhes de um evento pelo ID.
 */
function getEventById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = yield eventService.getById(req.params.id);
            res.json(event);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
}
/**
 * Cria um novo evento (admin).
 */
function createEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = yield eventService.create(Object.assign(Object.assign({}, req.body), { creatorId: req.userId }));
            res.status(201).json(event);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
/**
 * Atualiza um evento existente (admin).
 */
function updateEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = yield eventService.update(req.params.id, req.body);
            res.json(event);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
/**
 * Deleta um evento (admin).
 */
function deleteEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield eventService.remove(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
