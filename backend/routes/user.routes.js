// backend/routes/user.routes.js

import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route for user profile
router.get('/profile', protect, getUserProfile);

export default router;
