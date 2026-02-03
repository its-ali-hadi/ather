const { pool } = require('../config/database');

// Get active banners for public API
exports.getActiveBanners = async (req, res, next) => {
    try {
        const [banners] = await pool.query(
            'SELECT * FROM banners WHERE is_active = TRUE ORDER BY order_index ASC'
        );
        res.json({
            success: true,
            data: banners
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get all banners
exports.getAllBanners = async (req, res, next) => {
    try {
        const [banners] = await pool.query(
            'SELECT * FROM banners ORDER BY order_index ASC'
        );
        res.json({
            success: true,
            data: banners
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Create banner
exports.createBanner = async (req, res, next) => {
    try {
        const { title, icon, target_url, is_active, order_index } = req.body;
        let image_url = req.body.image_url;

        if (req.file) {
            image_url = `/uploads/images/${req.file.filename}`;
        }

        if (!title || !image_url) {
            return res.status(400).json({
                success: false,
                message: 'العنوان والصورة مطلوبان'
            });
        }

        // Handle types correctly (from FormData they come as strings)
        const isActiveVal = is_active === 'true' || is_active === true || is_active === undefined;
        const orderIndexVal = parseInt(order_index) || 0;

        const [result] = await pool.query(
            'INSERT INTO banners (title, image_url, icon, target_url, is_active, order_index) VALUES (?, ?, ?, ?, ?, ?)',
            [title, image_url, icon, target_url, isActiveVal, orderIndexVal]
        );

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                title,
                image_url,
                icon,
                target_url,
                is_active: isActiveVal,
                order_index: orderIndexVal
            }
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Update banner
exports.updateBanner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, icon, target_url, is_active, order_index } = req.body;
        let image_url = req.body.image_url;

        if (req.file) {
            image_url = `/uploads/images/${req.file.filename}`;
        }

        const isActiveVal = is_active === 'true' || is_active === true;
        const orderIndexVal = parseInt(order_index) || 0;

        let query = 'UPDATE banners SET title = ?, icon = ?, target_url = ?, is_active = ?, order_index = ?';
        let params = [title, icon, target_url, isActiveVal, orderIndexVal];

        if (image_url) {
            query += ', image_url = ?';
            params.push(image_url);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await pool.query(query, params);

        res.json({
            success: true,
            message: 'تم تحديث البنر بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Delete banner
exports.deleteBanner = async (req, res, next) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM banners WHERE id = ?', [id]);
        res.json({
            success: true,
            message: 'تم حذف البنر بنجاح'
        });
    } catch (error) {
        next(error);
    }
};
