const { Router } = require('express');
const itemController = require('../controllers/itemcontroller');
const protect = require('../middleware/authmiddleware');

const router = Router();

// Public routes
router.get('/items', itemController.getItems);
router.get('/items/top', itemController.getTopItems);
router.get('/items/category/:category', itemController.getItemsByCategory);
router.get('/items/:id', itemController.getItemById);

// Protected routes (Admin only)
router.post('/items', protect, itemController.createItem);
router.put('/items/:id', protect, itemController.updateItem);
router.delete('/items/:id', protect, itemController.deleteItem);

module.exports = router;
