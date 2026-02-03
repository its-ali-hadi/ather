const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', bannerController.getActiveBanners);

// Admin routes
router.get('/admin', auth, adminOnly, bannerController.getAllBanners);
router.post('/admin', auth, adminOnly, upload.single('image'), bannerController.createBanner);
router.put('/admin/:id', auth, adminOnly, upload.single('image'), bannerController.updateBanner);
router.delete('/admin/:id', auth, adminOnly, bannerController.deleteBanner);

module.exports = router;
