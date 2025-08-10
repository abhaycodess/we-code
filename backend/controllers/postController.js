import Post from '../models/Post.js';
import Notification from '../models/Notification.js';
import asyncHandler from 'express-async-handler';


// ✅ Create a post
export const createPost = async (req, res) => {
  try {
    const { text, image, video } = req.body;

    const newPost = await Post.create({
      user: req.user._id,
      text,
      image,
      video,
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error });
  }
};

// ✅ Get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // 🔍 ADD THIS: Search filter logic
  const searchQuery = req.query.search || '';
  const keyword = searchQuery
    ? {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { tags: { $regex: searchQuery, $options: 'i' } },
        ],
      }
    : {};

  // ✅ Combine with pagination
  const total = await Post.countDocuments(keyword);
  const posts = await Post.find(keyword)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('createdBy', 'username avatar');

  res.status(200).json({
    success: true,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    posts,
  });
});


// ✅ Get a single post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username')
      .populate('comments.user', 'username')
      .populate('comments.replies.user', 'username');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error });
  }
};

// ✅ Like/unlike post
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.status(200).json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle like', error });
  }
};

// ✅ Add comment to post
export const addCommentToPost = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      user: req.user._id,
      text,
      replies: [],
    };

    post.comments.push(newComment);
    await post.save();

    // ✅ Send notification to post owner
    if (post.user.toString() !== req.user._id.toString()) {
      try {
        await Notification.create({
          recipient: post.user,
          sender: req.user._id,
          type: 'comment',
          post: post._id,
        });
      } catch (notificationErr) {
        console.error('Failed to create comment notification:', notificationErr.message);
      }
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error });
  }
};

// ✅ Reply to comment
export const replyToComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const reply = {
      user: req.user._id,
      text,
    };

    comment.replies.push(reply);
    await post.save();

    // ✅ Send notification to original comment author
    if (comment.user.toString() !== req.user._id.toString()) {
      try {
        await Notification.create({
          recipient: comment.user,
          sender: req.user._id,
          type: 'reply',
          post: post._id,
        });
      } catch (notificationErr) {
        console.error('Failed to create reply notification:', notificationErr.message);
      }
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reply to comment', error });
  }
};

// ✅ Get comments of a post
export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('comments.user', 'username')
      .populate('comments.replies.user', 'username');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments', error });
  }
};

// ✅ Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error });
  }
};

// ✅ Update post
export const updatePost = async (req, res) => {
  try {
    const { text, image, video } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.text = text || post.text;
    post.image = image || post.image;
    post.video = video || post.video;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error });
  }
};

// ✅ Delete comment
export const deleteCommentFromPost = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    comment.remove();
    await post.save();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error });
  }
};

// ✅ Report post
export const reportPost = async (req, res) => {
  try {
    const { reason } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    // You can log reports somewhere if needed
    console.log(`Post reported by ${req.user._id} for: ${reason}`);

    res.status(200).json({ message: 'Post reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to report post', error });
  }
};

// ✅ Report comment
export const reportComment = async (req, res) => {
  try {
    const { reason } = req.body;
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // You can log reports somewhere if needed
    console.log(`Comment reported by ${req.user._id} for: ${reason}`);

    res.status(200).json({ message: 'Comment reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to report comment', error });
  }
};
