import express from 'express';
import {
  getNotifications,
  markAllNotificationsAsRead,   // new name (all)
  markNotificationAsRead       // new name (single)
} from '../controllers/notificationController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all notifications for logged-in user
router.get('/', protect, getNotifications);

// PUT mark ALL notifications as read
router.put('/mark-as-read', protect, markAllNotificationsAsRead);

// PUT mark SINGLE notification as read
router.put('/:id/read', protect, markNotificationAsRead);

export default router;
