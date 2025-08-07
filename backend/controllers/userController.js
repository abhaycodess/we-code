// backend/controllers/userController.js

import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// Register new user
const registerUser = async (req, res) => {
  const { name, username, email, password, gender } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Auto-generate avatar using Liara API
  const avatar = gender === 'male'
    ? `https://avatar.iran.liara.run/public/boy?username=${username}`
    : `https://avatar.iran.liara.run/public/girl?username=${username}`;

  // Create and save user
  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
    gender,
    avatar,
  });

  // Respond with user data and token
  res.status(201).json({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
};

// Get user profile
const getUserProfile = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  });
};

export { registerUser, getUserProfile };
