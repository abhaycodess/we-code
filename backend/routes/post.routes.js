// backend/routes/post.routes.js
import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  toggleLikePost,
  addCommentToPost,
  deletePost,
  updatePost,
  deleteCommentFromPost,
  replyToComment,
  getPostComments,
  reportPost,             // ✅ Import reportPost controller
  reportComment           // ✅ Import reportComment controller
} from '../controllers/postController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/', protect, createPost);              // Create post
router.get('/', protect, getAllPosts);              // Get all posts
router.post('/:postId/like', protect, toggleLikePost); // Like/unlike post
router.post('/:postId/comment', protect, addCommentToPost); // Add comment
router.put('/:id', protect, updatePost);
router.get('/:id/comments', protect, getPostComments);
router.delete('/:postId/comments/:commentId', protect, deleteCommentFromPost);
router.post('/:postId/comments/:commentId/replies', protect, replyToComment);

// ✅ Reporting routes
router.post('/:postId/report', protect, reportPost); // Report a post
router.post('/:postId/comments/:commentId/report', protect, reportComment); // Report a comment

router.delete('/:id', protect, deletePost);          // Delete post
router.get('/:id', protect, getPostById);            // Get single post

export default router;
