import { Hackathon } from '../models/Hackathon.js';
import User from '../models/User.js';

/**
 * Create Hackathon - Only for Organizations
 */
export const createHackathon = async (req, res) => {
  try {
    const { title, description, startDate, endDate, venue } = req.body;

    if (!title || !description || !startDate || !endDate || !venue) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure only organizations can create hackathons
    if (req.user.userType !== 'organization') {
      return res.status(403).json({ message: 'Only organizations can create hackathons' });
    }

    const newHackathon = new Hackathon({
      title,
      description,
      startDate,
      endDate,
      venue,
      organization: req.user._id, // organization ID
    });

    await newHackathon.save();

    res.status(201).json({
      message: 'Hackathon created successfully',
      hackathon: newHackathon,
    });
  } catch (error) {
    console.error('Error creating hackathon:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


/**
 * Get All Hackathons - Public
 */
export const getAllHackathons = async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find().populate('organization', 'username email');
    res.status(200).json(hackathons);
  } catch (err) {
    console.error('Error fetching hackathons:', err);
    next(err);
  }
};


/**
 * Get Hackathon By ID - Public
 */
export const getHackathonById = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).populate('organization', 'username email');
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    res.status(200).json(hackathon);
  } catch (err) {
    console.error('Error fetching hackathon by ID:', err);
    next(err);
  }
};


/**
 * Register User for Hackathon - Only for Normal Users
 */
export const registerUserForHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Only 'user' type users can register
    if (req.user.userType !== 'user') {
      return res.status(403).json({ message: 'Only users can register for hackathons' });
    }

    // Prevent duplicate registration
    if (hackathon.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this hackathon' });
    }

    hackathon.participants.push(req.user._id);
    await hackathon.save();

    res.status(200).json({ message: 'Successfully registered for the hackathon' });
  } catch (err) {
    console.error('Error registering user for hackathon:', err);
    next(err);
  }
};


/**
 * Get Participants for a Hackathon - Only Host Organization Can View
 */
export const getParticipantsForHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).populate('participants', 'username email');
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Only the organization that created the hackathon can view participants
    if (!hackathon.organization.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. Only host organization can view participants' });
    }

    res.status(200).json(hackathon.participants);
  } catch (err) {
    console.error('Error fetching hackathon participants:', err);
    next(err);
  }
};
