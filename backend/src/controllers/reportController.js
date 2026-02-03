const { pool } = require('../config/database');

// Create a report
exports.createReport = async (req, res, next) => {
    try {
        const { type, target_id, reason, description } = req.body;
        const reporter_id = req.user.id;

        if (!['post', 'user', 'comment'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'نوع الإبلاغ غير صالح'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO reports (reporter_id, type, target_id, reason, description) VALUES (?, ?, ?, ?, ?)',
            [reporter_id, type, target_id, reason, description]
        );

        res.status(201).json({
            success: true,
            message: 'تم إرسال الإبلاغ بنجاح وسيتم مراجعته من قبل الإدارة',
            data: {
                id: result.insertId
            }
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get all reports
exports.getAllReports = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const { status, type } = req.query;

        let query = `
      SELECT r.*, 
             u.name as reporter_name, u.phone as reporter_phone
      FROM reports r
      JOIN users u ON r.reporter_id = u.id
      WHERE 1=1
    `;
        const params = [];

        if (status) {
            query += ' AND r.status = ?';
            params.push(status);
        }
        if (type) {
            query += ' AND r.type = ?';
            params.push(type);
        }

        query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [reports] = await pool.query(query, params);

        // Get target details (this is a bit complex due to polymorphic nature)
        // We'll fetch basic info for each report type
        for (let report of reports) {
            if (report.type === 'post') {
                const [posts] = await pool.query('SELECT title, content FROM posts WHERE id = ?', [report.target_id]);
                report.target_data = posts[0] || { title: 'منشور محذوف' };
            } else if (report.type === 'user') {
                const [users] = await pool.query('SELECT name, phone FROM users WHERE id = ?', [report.target_id]);
                report.target_data = users[0] || { name: 'حساب محذوف' };
            } else if (report.type === 'comment') {
                const [comments] = await pool.query('SELECT content FROM comments WHERE id = ?', [report.target_id]);
                report.target_data = comments[0] || { content: 'تعليق محذوف' };
            }
        }

        const [total] = await pool.query('SELECT COUNT(*) as count FROM reports');

        res.json({
            success: true,
            data: reports,
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

// Admin: Update report status
exports.updateReportStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, admin_notes } = req.body;

        await pool.query(
            'UPDATE reports SET status = ?, admin_notes = ? WHERE id = ?',
            [status, admin_notes, id]
        );

        res.json({
            success: true,
            message: 'تم تحديث حالة الإبلاغ بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get report details
exports.getReportDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [reports] = await pool.query(`
      SELECT r.*, 
             u.name as reporter_name, u.phone as reporter_phone
      FROM reports r
      JOIN users u ON r.reporter_id = u.id
      WHERE r.id = ?
    `, [id]);

        if (reports.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'الإبلاغ غير موجود'
            });
        }

        const report = reports[0];

        // Fetch full target details
        if (report.type === 'post') {
            const [data] = await pool.query('SELECT * FROM posts WHERE id = ?', [report.target_id]);
            report.target_details = data[0];
        } else if (report.type === 'user') {
            const [data] = await pool.query('SELECT id, name, phone, email, bio, profile_image, created_at FROM users WHERE id = ?', [report.target_id]);
            report.target_details = data[0];
        } else if (report.type === 'comment') {
            const [data] = await pool.query('SELECT * FROM comments WHERE id = ?', [report.target_id]);
            report.target_details = data[0];
        }

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        next(error);
    }
};
