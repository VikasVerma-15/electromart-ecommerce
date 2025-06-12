const { Router } = require('express');
const cartController = require('../controllers/cartcontroller');
const protect = require('../middleware/authmiddleware');

const router = Router();

router.get('/cart/:id', protect, cartController.getCart);
router.post('/cart/:id', protect, cartController.addToCart);
router.put('/cart/:id', protect, cartController.updateCart);
router.delete('/cart/:userId/:itemId', protect, cartController.deleteCartItem);

module.exports = router;
