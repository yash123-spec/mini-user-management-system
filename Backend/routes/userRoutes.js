import express from 'express';
import { getAllUsers, activateUser, deactivateUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only routes
router.get('/', protect, admin, getAllUsers);
router.patch('/:id/activate', protect, admin, activateUser);
router.patch('/:id/deactivate', protect, admin, deactivateUser);

export default router;
