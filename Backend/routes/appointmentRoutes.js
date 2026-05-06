import express from 'express';
import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/', protect, admin, getAllAppointments);
router.put('/:id', protect, admin, updateAppointmentStatus);
router.delete('/:id', protect, cancelAppointment);

export default router;
