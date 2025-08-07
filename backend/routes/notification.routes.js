import express from 'express';
import { getNotifications, markNotificationsAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all notifications for logged-in user
router.get('/', protect, getNotifications);

// PUT mark all notifications as read
router.put('/mark-as-read', protect, markNotificationsAsRead);

export default router;

