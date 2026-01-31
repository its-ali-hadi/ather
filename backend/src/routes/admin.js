const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(isAdmin);

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

// Notifications
router.post('/notifications/send', adminController.sendNotification);

module.exports = router;