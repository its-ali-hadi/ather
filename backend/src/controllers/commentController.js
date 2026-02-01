const { pool } = require('../config/database');

// Create comment
exports.createComment = async (req, res, next) => {
  try {
    const { post_id, content, parent_id } = req.body;
    const userId = req.user.id;

    // Check if post exists
    const [posts] = await pool.query(
      'SELECT id, user_id FROM posts WHERE id = ?',
      [post_id]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنشور غير موجود'
      });
    }

    // If parent_id exists, check if parent comment exists
    if (parent_id) {
      const [parentComments] = await pool.query(
        'SELECT id FROM comments WHERE id = ? AND post_id = ?',
        [parent_id, post_id]
      );

      if (parentComments.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'التعليق الأصلي غير موجود'
        });
      }
    }

    // Create comment
    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)',
      [post_id, userId, content, parent_id]
    );

    // Get created comment with user info
    const [comments] = await pool.query(
      `SELECT c.*, u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    // Create notification for post owner (if not commenting on own post)
    if (posts[0].user_id !== userId) {
      await pool.query(
        'INSERT INTO notifications (user_id, type, content, related_id) VALUES (?, ?, ?, ?)',
        [posts[0].user_id, 'comment', 'علق على منشورك', post_id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'تم إضافة التعليق بنجاح',
      data: comments[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get post comments
exports.getPostComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Get top-level comments (no parent)
    const [comments] = await pool.query(
      `SELECT c.*, u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified,
              (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as replies_count
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ? AND c.parent_id IS NULL
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [postId, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM comments WHERE post_id = ? AND parent_id IS NULL',
      [postId]
    );

    res.json({
      success: true,
      data: comments,
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

// Get comment replies
exports.getCommentReplies = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [replies] = await pool.query(
      `SELECT c.*, u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.parent_id = ?
       ORDER BY c.created_at ASC
       LIMIT ? OFFSET ?`,
      [commentId, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM comments WHERE parent_id = ?',
      [commentId]
    );

    res.json({
      success: true,
      data: replies,
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

// Update comment
exports.updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    // Check if comment exists and belongs to user
    const [comments] = await pool.query(
      'SELECT user_id FROM comments WHERE id = ?',
      [commentId]
    );

    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'التعليق غير موجود'
      });
    }

    if (comments[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بتعديل هذا التعليق'
      });
    }

    // Update comment
    await pool.query(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content, commentId]
    );

    // Get updated comment
    const [updatedComments] = await pool.query(
      `SELECT c.*, u.name as user_name, u.profile_image as user_image, u.is_verified as user_verified
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [commentId]
    );

    res.json({
      success: true,
      message: 'تم تحديث التعليق بنجاح',
      data: updatedComments[0]
    });
  } catch (error) {
    next(error);
  }
};

// Delete comment
exports.deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    // Check if comment exists and belongs to user
    const [comments] = await pool.query(
      'SELECT user_id FROM comments WHERE id = ?',
      [commentId]
    );

    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'التعليق غير موجود'
      });
    }

    if (comments[0].user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بحذف هذا التعليق'
      });
    }

    // Delete comment (will cascade delete replies)
    await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);

    res.json({
      success: true,
      message: 'تم حذف التعليق بنجاح'
    });
  } catch (error) {
    next(error);
  }
};