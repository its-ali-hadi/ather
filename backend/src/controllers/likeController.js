const { pool } = require('../config/database');

// Toggle like on post
exports.toggleLike = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    // Check if post exists
    const [posts] = await pool.query(
      'SELECT id, user_id FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    // Check if already liked
    const [existingLikes] = await pool.query(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existingLikes.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );

      return res.json({
        success: true,
        message: 'تم إلغاء الإعجاب',
        data: { isLiked: false }
      });
    } else {
      // Like
      await pool.query(
        'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );

      // Create notification for post owner (if not liking own post)
      if (posts[0].user_id !== userId) {
        await pool.query(
          'INSERT INTO notifications (user_id, type, content, related_id) VALUES (?, ?, ?, ?)',
          [posts[0].user_id, 'like', 'أعجب بمنشورك', postId]
        );
      }

      return res.json({
        success: true,
        message: 'تم الإعجاب بالمنشور',
        data: { isLiked: true }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get post likes
exports.getPostLikes = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [likes] = await pool.query(
      `SELECT u.id, u.name, u.profile_image, u.is_verified, l.created_at
       FROM likes l
       JOIN users u ON l.user_id = u.id
       WHERE l.post_id = ?
       ORDER BY l.created_at DESC
       LIMIT ? OFFSET ?`,
      [postId, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM likes WHERE post_id = ?',
      [postId]
    );

    res.json({
      success: true,
      data: likes,
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