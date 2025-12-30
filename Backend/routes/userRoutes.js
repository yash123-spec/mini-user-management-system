import express from 'express';
import { getAllUsers, activateUser, deactivateUser, getMe, updateMe } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin and user routes
router.get('/', protect, admin, getAllUsers);
router.patch('/:id/activate', protect, admin, activateUser);
router.patch('/:id/deactivate', protect, admin, deactivateUser);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);

export default router;
