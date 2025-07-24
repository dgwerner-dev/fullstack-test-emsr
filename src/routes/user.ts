import { Router } from 'express';
import { deleteProfile, deleteUserById, getAllUsers, getProfile, getUserById, updateProfile, updateUserById } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Rotas para o próprio usuário
router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);
router.delete('/me', authenticate, deleteProfile);

// Rotas para admin
router.get('/', authenticate, authorize(['ADMIN']), getAllUsers);
router.get('/:id', authenticate, authorize(['ADMIN']), getUserById);
router.put('/:id', authenticate, authorize(['ADMIN']), updateUserById);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteUserById);

export default router; 