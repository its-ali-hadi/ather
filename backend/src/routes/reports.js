const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, adminOnly } = require('../middleware/auth');

// Public/User routes
router.post('/', auth, reportController.createReport);

// Admin routes
router.get('/admin', auth, adminOnly, reportController.getAllReports);
router.get('/admin/:id', auth, adminOnly, reportController.getReportDetails);
router.put('/admin/:id/status', auth, adminOnly, reportController.updateReportStatus);

module.exports = router;
