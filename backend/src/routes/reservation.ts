import { Router } from 'express';
import { cancelReservation, getEventReservations, getMyReservations, reserveSpot } from '../controllers/reservationController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/events/:id/reserve', authenticate, authorize(['USER']), reserveSpot);
router.delete('/:id', authenticate, cancelReservation);
router.get('/my-reservations', authenticate, authorize(['USER', 'ADMIN']), getMyReservations);
router.get('/events/:id/reservations', authenticate, authorize(['ADMIN']), getEventReservations);

export default router; 