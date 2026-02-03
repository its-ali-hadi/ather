const { pool } = require('../config/database');

// Get user notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [notifications] = await pool.query(
      `SELECT n.*, 
              u.name as sender_name, u.profile_image as sender_image
       FROM notifications n
       LEFT JOIN users u ON n.sender_id = u.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ?',
      [userId]
    );

    const [unreadCount] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({
      success: true,
      data: notifications,
      unreadCount: unreadCount[0].count,
      pagination: {
        page,
        limit,
        total: total[0].count,
        pages: Math.ceil(total[0].count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    // Check if notification belongs to user
    const [notifications] = await pool.query(
      'SELECT user_id FROM notifications WHERE id = ?',
      [notificationId]
    );

    if (notifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الإشعار غير موجود'
      });
    }

    if (notifications[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بالوصول لهذا الإشعار'
      });
    }

    // Mark as read
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ?',
      [notificationId]
    );

    res.json({
      success: true,
      message: 'تم تحديث الإشعار'
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({
      success: true,
      message: 'تم تحديث جميع الإشعارات'
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    // Check if notification belongs to user
    const [notifications] = await pool.query(
      'SELECT user_id FROM notifications WHERE id = ?',
      [notificationId]
    );

    if (notifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الإشعار غير موجود'
      });
    }

    if (notifications[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بحذف هذا الإشعار'
      });
    }

    // Delete notification
    await pool.query('DELETE FROM notifications WHERE id = ?', [notificationId]);

    res.json({
      success: true,
      message: 'تم حذف الإشعار'
    });
  } catch (error) {
    next(error);
  }
};