const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use(adminAuth);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/verify', adminController.verifyUser);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/ban', adminController.banUser);
router.put('/users/:id/unban', adminController.unbanUser);

// Post Management
router.get('/posts', adminController.getAllPosts);
router.delete('/posts/:id', adminController.deletePost);
router.put('/posts/:id/feature', adminController.featurePost);

// Reports Management
router.get('/reports', adminController.getAllReports);
router.put('/reports/:id/resolve', adminController.resolveReport);

// System Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;