import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Add comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const newComment = await Comment.create({
      post: postId,
      author: req.user._id,
      content: comment,
    });

    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.user,
        sender: req.user._id,
        type: 'comment',
        message: `${req.user.username} commented on your post.`,
        relatedPost: post._id,
      });
    }

    const mentionedUsernames = comment.match(/@[\w]+/g);
    if (mentionedUsernames) {
      for (const handle of mentionedUsernames) {
        const username = handle.substring(1);
        const taggedUser = await User.findOne({ username });

        if (
          taggedUser &&
          taggedUser._id.toString() !== req.user._id.toString() &&
          taggedUser._id.toString() !== post.user.toString()
        ) {
          await Notification.create({
            recipient: taggedUser._id,
            sender: req.user._id,
            type: 'mention',
            message: `${req.user.username} mentioned you in a comment.`,
            relatedPost: post._id,
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message || error,
    });
  }
};
