// controllers/projectController.js
import Project from '../models/Project.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, tags, githubUrl, liveUrl, imageUrl } = req.body;

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

