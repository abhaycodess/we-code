import { Hackathon } from '../models/Hackathon.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

import asyncHandler from 'express-async-handler';
import { bucket } from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @desc    Create a new hackathon (Organization only)
 * @route   POST /api/hackathons
 * @access  Private (organization)
 */
export const createHackathon = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate, venue } = req.body;

  if (!title || !description || !startDate || !endDate || !venue) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (req.user.userType !== 'organization') {
    return res.status(403).json({ message: 'Only organizations can create hackathons' });
  }

  const newHackathon = new Hackathon({
    title,
    description,
    startDate,
    endDate,
    venue,
    organization: req.user._id,
  });

  await newHackathon.save();

  res.status(201).json({
    message: 'Hackathon created successfully',
    hackathon: newHackathon,
  });
});

/**
 * @desc    Get all hackathons (Public)
 * @route   GET /api/hackathons
 * @access  Public
 */
export const getAllHackathons = asyncHandler(async (req, res) => {
  const hackathons = await Hackathon.find().populate('organization', 'username email');
  res.status(200).json(hackathons);
});

/**
 * @desc    Get a single hackathon by ID (Public)
 * @route   GET /api/hackathons/:id
 * @access  Public
 */
export const getHackathonById = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id).populate('organization', 'username email');

  if (!hackathon) {
    return res.status(404).json({ message: 'Hackathon not found' });
  }

  res.status(200).json(hackathon);
});

/**
 * @desc    Register a user for a hackathon (Users only)
 * @route   POST /api/hackathons/:id/register
 * @access  Private (user)
 */
export const registerUserForHackathon = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id);

  if (!hackathon) {
    return res.status(404).json({ message: 'Hackathon not found' });
  }

  if (req.user.userType !== 'user') {
    return res.status(403).json({ message: 'Only users can register for hackathons' });
  }

  if (hackathon.participants.includes(req.user._id)) {
    return res.status(400).json({ message: 'Already registered for this hackathon' });
  }

  hackathon.participants.push(req.user._id);
  await hackathon.save();

  res.status(200).json({ message: 'Successfully registered for the hackathon' });
});

/**
 * @desc    Get participants for a hackathon (Org only)
 * @route   GET /api/hackathons/:id/participants
 * @access  Private (organization)
 */
export const getParticipantsForHackathon = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.findById(req.params.id).populate('participants', 'username email');

  if (!hackathon) {
    return res.status(404).json({ message: 'Hackathon not found' });
  }

  if (!hackathon.organization.equals(req.user._id)) {
    return res.status(403).json({ message: 'Access denied. Only host organization can view participants' });
  }

  res.status(200).json(hackathon.participants);
});

/**
 * @desc    Get all project submissions for a hackathon
 * @route   GET /api/hackathons/:id/submissions
 * @access  Public or Private
 */
export const getHackathonSubmissions = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const submissions = await Project.find({ hackathon: id })
    .populate('createdBy', 'username avatar')
    .sort({ createdAt: -1 });

  res.json(submissions);
});

/**
 * @desc    Upload problem statement PDF (Organizations only)
 * @route   POST /api/hackathons/:id/upload-problem
 * @access  Private (organization)
 */
export const uploadProblemStatement = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const file = req.file;
  const fileName = `problem-statements/${uuidv4()}_${file.originalname}`;
  const blob = bucket.file(fileName);

  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on('error', (err) => {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Upload error', error: err });
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    // Optional: Update the hackathon with the problem statement URL
    await Hackathon.findByIdAndUpdate(req.params.id, {
      problemStatementUrl: publicUrl,
    });

    return res.status(200).json({
      message: 'File uploaded successfully',
      url: publicUrl,
    });
  });

  blobStream.end(file.buffer);
});
