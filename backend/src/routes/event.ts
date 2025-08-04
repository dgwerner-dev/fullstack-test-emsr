import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from '../controllers/eventController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', authenticate, authorize(['ADMIN']), createEvent);
router.put('/:id', authenticate, authorize(['ADMIN']), updateEvent);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteEvent);

export default router;
