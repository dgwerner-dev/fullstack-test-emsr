"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Rotas para o próprio usuário
router.get('/me', authMiddleware_1.authenticate, userController_1.getProfile);
router.put('/me', authMiddleware_1.authenticate, userController_1.updateProfile);
router.delete('/me', authMiddleware_1.authenticate, userController_1.deleteProfile);
// Rotas para admin
router.get('/', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['ADMIN']), userController_1.getAllUsers);
router.get('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['ADMIN']), userController_1.getUserById);
router.put('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['ADMIN']), userController_1.updateUserById);
router.delete('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['ADMIN']), userController_1.deleteUserById);
exports.default = router;
