import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Register new user or organization
// @route   POST /api/auth/register
// @access  Public
// backend/controllers/authController.js

// @desc    Register new user or organization
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      avatar,
      bio,
      userType = 'user', // 'user' or 'organization'
      orgName,
      website,
      organizationBio,
    } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Username, email, and password are required');
    }

    if (userType === 'organization' && !orgName) {
      res.status(400);
      throw new Error('Organization name is required for organizations');
    }

    // Check if user/email exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400);
      throw new Error('User with this email or username already exists');
    }

    // Don't hash here — Mongoose handles it
    const userData = {
      username,
      email,
      password,
      avatar,
      bio,
      userType,
    };

    if (userType === 'organization') {
      userData.orgName = orgName;
      userData.website = website || '';
      userData.organizationBio = organizationBio || '';
    }

    const user = await User.create(userData);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      userType: user.userType,
      orgName: user.orgName,
      website: user.website,
      organizationBio: user.organizationBio,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      res.status(400);
      return next(new Error('Email/Username and password are required'));
    }

    const normalizedInput = emailOrUsername.toLowerCase();

    const user = await User.findOne({
      $or: [{ email: normalizedInput }, { username: emailOrUsername }],
    });

    if (!user) {
      res.status(401);
      return next(new Error('User not found'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Invalid password'));
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      userType: user.userType,
      orgName: user.orgName,
      website: user.website,
      organizationBio: user.organizationBio,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};
