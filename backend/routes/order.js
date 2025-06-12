const { Router } = require('express');
const router = Router();
const orderController = require('../controllers/ordercomponent');
const protect = require('../middleware/authmiddleware');

// Order routes
router.post('/orders', protect, orderController.createOrders);
router.get('/orders/:userId', protect, orderController.getOrders);
router.get('/orders/detail/:orderId', protect, orderController.getOrderById);
router.put('/orders/:orderId/status', protect, orderController.updateOrderStatus);

module.exports = router;
