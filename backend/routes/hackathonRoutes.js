import express from 'express';
import protect from '../middleware/protect.js';
import restrictTo from '../middleware/restrictTo.js';
import upload from '../middleware/uploadMiddleware.js'; // 🔹 Multer for memory upload
import {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  registerUserForHackathon,
  getParticipantsForHackathon,
  getHackathonSubmissions,
  uploadProblemStatement // 🔹 New controller
} from '../controllers/hackathonController.js';

const router = express.Router();

/* 
|-------------------------------------------------------------------------- 
| Hackathon Routes 
|-------------------------------------------------------------------------- 
| Route Prefix: /api/hackathons 
| Access: Public, Users, Organizations 
| Description: Handles creation, listing, registration, and participant views. 
*/

/**
 * @route   POST /api/hackathons/
 * @desc    Create a new hackathon
 * @access  Private (Organizations only)
 */
router.post('/', protect, restrictTo('organization'), createHackathon);

/**
 * @route   GET /api/hackathons/
 * @desc    Fetch all hackathons
 * @access  Public
 */
router.get('/', getAllHackathons);

/**
 * @route   GET /api/hackathons/:id
 * @desc    Get a single hackathon by ID
 * @access  Public
 */
router.get('/:id', getHackathonById);

/**
 * @route   POST /api/hackathons/:id/register
 * @desc    Register an authenticated user for a hackathon
 * @access  Private (Users only)
 */
router.post('/:id/register', protect, restrictTo('user'), registerUserForHackathon);

/**
 * @route   GET /api/hackathons/:id/participants
 * @desc    Get all participants of a specific hackathon
 * @access  Private (Organizations only)
 */
router.get('/:id/participants', protect, restrictTo('organization'), getParticipantsForHackathon);

/**
 * @route   GET /api/hackathons/:id/submissions
 * @desc    View submitted projects for a hackathon
 * @access  Private (Organizations only)
 */
router.get('/:id/submissions', protect, restrictTo('organization'), getHackathonSubmissions);

/**
 * @route   POST /api/hackathons/:id/upload-problem
 * @desc    Upload a problem statement file (PDF/DOCX) for a hackathon
 * @access  Private (Organizations only)
 */
router.post(
  '/:id/upload-problem',
  protect,
  restrictTo('organization'),
  upload.single('file'), // Expecting a 'file' field in form-data
  uploadProblemStatement
);

export default router;
