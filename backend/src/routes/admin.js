const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');
const bannerController = require('../controllers/bannerController');
const boxController = require('../controllers/boxController');
const reportController = require('../controllers/reportController');
const upload = require('../middleware/upload');

// Apply authentication and admin check to all routes
router.use(auth);
router.use(adminOnly);

// Stats
router.get('/stats', adminController.getStats);

// Users
router.get('/users', adminController.getUsers);
router.get('/users/recent', adminController.getRecentUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/ban', adminController.banUser);
router.put('/users/:id/unban', adminController.unbanUser);
router.delete('/users/:id', adminController.deleteUser);

// Posts
router.get('/posts', adminController.getPosts);
router.get('/posts/recent', adminController.getRecentPosts);
router.delete('/posts/:id', adminController.deletePost);

// Comments
router.get('/comments', adminController.getComments);
router.delete('/comments/:id', adminController.deleteComment);

// Boxes & Categories
router.get('/boxes', boxController.getAllBoxes);
router.get('/boxes/all', boxController.getAllBoxes); // Alias
router.post('/boxes', boxController.createBox);
router.put('/boxes/:id', boxController.updateBox);
router.delete('/boxes/:id', boxController.deleteBox);

router.get('/categories', boxController.getAllCategories);
router.get('/categories/all', boxController.getAllCategories); // Alias
router.post('/categories', boxController.createCategory);
router.put('/categories/:id', boxController.updateCategory);
router.delete('/categories/:id', boxController.deleteCategory);

// Banners
router.get('/banners', bannerController.getAllBanners);
router.get('/banners/all', bannerController.getAllBanners); // Alias
router.post('/banners', upload.single('image'), bannerController.createBanner);
router.put('/banners/:id', upload.single('image'), bannerController.updateBanner);
router.delete('/banners/:id', bannerController.deleteBanner);

// Reports
router.get('/reports', reportController.getAllReports);
router.get('/reports/:id', reportController.getReportDetails);
router.put('/reports/:id/status', reportController.updateReportStatus);

// Notifications
router.post('/notifications/send', adminController.sendNotification);

module.exports = router;