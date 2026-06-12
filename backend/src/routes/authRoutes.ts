import express from 'express';
import { register, login, logout, refresh, getMe, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
