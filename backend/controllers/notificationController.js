import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// ✅ Get all notifications for the logged-in user
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notifications.length,
    notifications,
  });
});

// ✅ Mark all notifications as read
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

// ✅ Mark a specific notification as read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification || notification.recipient.toString() !== req.user._id.toString()) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found or unauthorized',
    });
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
  });
});

