// backend/routes/auth.routes.js

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Optional: Health check route (can be removed in production)
router.get('/test', (req, res) => {
  res.send('✅ Auth route is working!');
});

export default router;
