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
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.deleteProfile = deleteProfile;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUserById = updateUserById;
exports.deleteUserById = deleteUserById;
const userService = __importStar(require("../services/userService"));
// Retorna perfil do usuário
function getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userService.getById(req.userId);
            res.json(user);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
}
// Atualiza perfil do usuário
function updateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userService.updateById(req.userId, req.body);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
// Deleta perfil do usuário
function deleteProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield userService.deleteById(req.userId);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
// Admin: lista todos os usuários
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield userService.getAll();
        res.json(users);
    });
}
// Admin: busca usuário por ID
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userService.getById(req.params.id);
            res.json(user);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
}
// Admin: atualiza usuário
function updateUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userService.updateById(req.params.id, req.body);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
// Admin: deleta usuário
function deleteUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield userService.deleteById(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
