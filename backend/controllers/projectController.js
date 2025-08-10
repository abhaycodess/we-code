// controllers/projectController.js
import Project from '../models/Project.js';
import Hackathon from '../models/Hackathon.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, tags, githubUrl, liveUrl, imageUrl, hackathonId } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const project = new Project({
    title,
    description,
    tags,
    githubUrl,
    liveUrl,
    imageUrl,
    createdBy: req.user._id,
    hackathon: hackathonId,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().populate('createdBy', 'username avatar');
  res.json(projects);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  const { title, description, tags, githubUrl, liveUrl, imageUrl } = req.body;

  project.title = title || project.title;
  project.description = description || project.description;
  project.tags = tags || project.tags;
  project.githubUrl = githubUrl || project.githubUrl;
  project.liveUrl = liveUrl || project.liveUrl;
  project.imageUrl = imageUrl || project.imageUrl;

  const updatedProject = await project.save();
  res.json(updatedProject);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this project');
  }

  await project.deleteOne();
  res.json({ message: 'Project deleted' });
});

// @desc    Submit project to a hackathon
// @route   POST /api/hackathons/:id/submit
// @access  Private (users only)
export const submitProjectToHackathon = asyncHandler(async (req, res) => {
  const { id: hackathonId } = req.params;
  const userId = req.user._id;

  const { title, description, tags, githubUrl, liveUrl, imageUrl } = req.body;

  // 1. Find the hackathon
  const hackathon = await Hackathon.findById(hackathonId);
  if (!hackathon) {
    res.status(404);
    throw new Error('Hackathon not found');
  }

  // 2. Check if user is registered
  const isRegistered = hackathon.participants.includes(userId);
  if (!isRegistered) {
    res.status(403);
    throw new Error('You are not registered for this hackathon');
  }

  // 3. Prevent duplicate submissions
  const existing = await Project.findOne({ hackathon: hackathonId, createdBy: userId });
  if (existing) {
    res.status(400);
    throw new Error('You have already submitted a project for this hackathon');
  }

  // 4. Create project
  const project = new Project({
    title,
    description,
    tags,
    githubUrl,
    liveUrl,
    imageUrl,
    createdBy: userId,
    hackathon: hackathonId,
  });

  const createdProject = await project.save();
  res.status(201).json({
    message: 'Project submitted to hackathon successfully',
    project: createdProject,
  });
});
