const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');
const { auth } = require('../middleware/auth');

// Public routes
router.get('/', boxController.getBoxes);
router.get('/categories', boxController.getCategories);
router.get('/:id', boxController.getBox);

// Admin routes
router.use(auth);
const { adminOnly } = require('../middleware/auth');
router.get('/admin/all', adminOnly, boxController.getAllBoxes);
router.post('/admin', adminOnly, boxController.createBox);
router.put('/admin/:id', adminOnly, boxController.updateBox);
router.delete('/admin/:id', adminOnly, boxController.deleteBox);

router.get('/admin/categories/all', adminOnly, boxController.getAllCategories);
router.post('/admin/categories', adminOnly, boxController.createCategory);
router.put('/admin/categories/:id', adminOnly, boxController.updateCategory);
router.delete('/admin/categories/:id', adminOnly, boxController.deleteCategory);

module.exports = router;