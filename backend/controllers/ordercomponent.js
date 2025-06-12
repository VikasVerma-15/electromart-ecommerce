const Order = require('../models/order');
const Cart = require('../models/cart');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// Create order from cart
module.exports.createOrders = asyncHandler(async (req, res) => {
  const { userId, cartId } = req.body;

  const userCart = await Cart.findById({ _id: cartId });
  
  if (!userCart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Verify if cart is associated to the specific user
  if (userCart.userId !== userId) {
    res.status(403);
    throw new Error('Cart does not belong to user');
  }

  const amountValue = userCart.bill;
  const items = userCart.items;

  try {
    // Create order
    const order = await Order.create({
      _id: `order_${Date.now()}_${userId}`,
      userId,
      items,
      bill: amountValue,
      status: 'Pending'
    });

    // Clear the cart after order creation
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json(order);
  } catch (err) {
    res.status(500);
    throw new Error('Failed to create order');
  }
});

// Get user orders
module.exports.getOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const orders = await Order.find({ userId }).sort({ date_added: -1 });
  res.json(orders);
});

// Get single order
module.exports.getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  res.json(order);
});

// Update order status
module.exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  const updatedOrder = await order.save();
  
  res.json(updatedOrder);
});

