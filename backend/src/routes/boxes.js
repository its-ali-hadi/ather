const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', boxController.getBoxes);
router.get('/categories', boxController.getCategories);
router.get('/:id', boxController.getBox);

// Admin routes
router.use(protect);
router.get('/admin/all', boxController.getAllBoxes);
router.post('/admin', boxController.createBox);
router.put('/admin/:id', boxController.updateBox);
router.delete('/admin/:id', boxController.deleteBox);

router.get('/admin/categories/all', boxController.getAllCategories);
router.post('/admin/categories', boxController.createCategory);
router.put('/admin/categories/:id', boxController.updateCategory);
router.delete('/admin/categories/:id', boxController.deleteCategory);

module.exports = router;