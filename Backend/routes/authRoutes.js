import express from 'express';
import { signup, login, refreshToken, getMe, logout, getAllUsers, updateProfile, changePassword } from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.get('/users', protect, admin, getAllUsers);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
