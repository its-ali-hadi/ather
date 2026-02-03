const { pool } = require('../config/database');

// Create contact message
exports.createContactMessage = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user?.id;

    // Get user info if authenticated
    let name = null;
    let email = null;
    let phone = null;

    if (userId) {
      const [users] = await pool.query(
        'SELECT name, email, phone FROM users WHERE id = ?',
        [userId]
      );
      if (users.length > 0) {
        name = users[0].name;
        email = users[0].email;
        phone = users[0].phone;
      }
    }

    const [result] = await pool.query(
      'INSERT INTO contact_messages (user_id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, phone, subject, message]
    );

    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.',
      data: {
        id: result.insertId,
        subject,
        message,
        status: 'pending',
        created_at: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all contact messages (Admin only)
exports.getAllMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let query = `
      SELECT cm.*, 
             u.name as user_name, u.email as user_email, u.phone as user_phone,
             admin.name as replied_by_name
      FROM contact_messages cm
      LEFT JOIN users u ON cm.user_id = u.id
      LEFT JOIN users admin ON cm.replied_by = admin.id
    `;

    const params = [];

    if (status) {
      query += ' WHERE cm.status = ?';
      params.push(status);
    }

    query += ' ORDER BY cm.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [messages] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM contact_messages';
    const countParams = [];

    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }

    const [total] = await pool.query(countQuery, countParams);

    // Get counts by status
    const [statusCounts] = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM contact_messages
      GROUP BY status
    `);

    const counts = {
      pending: 0,
      read: 0,
      replied: 0,
      closed: 0,
    };

    statusCounts.forEach((row) => {
      counts[row.status] = row.count;
    });

    res.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total: total[0].count,
        pages: Math.ceil(total[0].count / limit),
      },
      counts,
    });
  } catch (error) {
    next(error);
  }
};

// Get single message (Admin only)
exports.getMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;

    const [messages] = await pool.query(
      `SELECT cm.*, 
              u.name as user_name, u.email as user_email, u.phone as user_phone,
              admin.name as replied_by_name
       FROM contact_messages cm
       LEFT JOIN users u ON cm.user_id = u.id
       LEFT JOIN users admin ON cm.replied_by = admin.id
       WHERE cm.id = ?`,
      [messageId]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة',
      });
    }

    res.json({
      success: true,
      data: messages[0],
    });
  } catch (error) {
    next(error);
  }
};

// Update message status (Admin only)
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['pending', 'read', 'replied', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صالحة',
      });
    }

    await pool.query(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      [status, messageId]
    );

    res.json({
      success: true,
      message: 'تم تحديث حالة الرسالة بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// Reply to message (Admin only)
exports.replyToMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const { reply } = req.body;
    const adminId = req.user.id;

    await pool.query(
      'UPDATE contact_messages SET admin_reply = ?, replied_by = ?, replied_at = NOW(), status = ? WHERE id = ?',
      [reply, adminId, 'replied', messageId]
    );

    // Get message details to send notification
    const [messages] = await pool.query(
      'SELECT user_id, subject FROM contact_messages WHERE id = ?',
      [messageId]
    );

    if (messages.length > 0 && messages[0].user_id) {
      // Send notification to user
      await pool.query(
        'INSERT INTO notifications (user_id, type, title, content, body) VALUES (?, ?, ?, ?, ?)',
        [
          messages[0].user_id,
          'admin',
          'رد على رسالتك',
          `تم الرد على رسالتك: ${messages[0].subject}`,
          `تم الرد على رسالتك: ${messages[0].subject}`
        ]
      );
    }

    res.json({
      success: true,
      message: 'تم إرسال الرد بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// Delete message (Admin only)
exports.deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;

    await pool.query('DELETE FROM contact_messages WHERE id = ?', [messageId]);

    res.json({
      success: true,
      message: 'تم حذف الرسالة بنجاح',
    });
  } catch (error) {
    next(error);
  }
};

// Get user's own messages
exports.getUserMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [messages] = await pool.query(
      `SELECT * FROM contact_messages 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [total] = await pool.query(
      'SELECT COUNT(*) as count FROM contact_messages WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total: total[0].count,
        pages: Math.ceil(total[0].count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};