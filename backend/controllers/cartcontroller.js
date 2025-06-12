const Cart = require('../models/cart');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');

module.exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  let cart = await Cart.findOne({ userId });

  if (cart && cart.items.length > 0) {
    res.json(cart);
  } else {
    res.json(null);
  }
});

module.exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { productId } = req.body;
  const quantity = Number.parseInt(req.body.quantity);

  let cart = await Cart.findOne({ userId });
  let itemDetails = await Item.findOne({ _id: productId });

  if (!itemDetails) {
    res.status(404);
    throw new Error('Product not found');
  }

  const price = itemDetails.price;
  const title = itemDetails.title;
  const images = itemDetails.images;

  if (cart) {
    //if cart exist for the user
    let indexFound = cart.items.findIndex(p => p.productId == productId);

    //check if product exist or not
    if (indexFound !== -1) {
      let productItem = cart.items[indexFound];
      productItem.quantity += quantity;
      cart.items[indexFound] = productItem;
    } else {
      cart.items.push({ productId, title, quantity, price, images });
    }

    cart.bill += quantity * price;
    cart = await cart.save();
    return res.status(201).json(cart);
  } else {
    //create cart if doesn't exist
    const newCart = await Cart.create({
      userId,
      items: [{ productId, title, quantity, price, images }],
      bill: quantity * price
    });

    return res.status(201).json(newCart);
  }
});

module.exports.updateCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { productId, qty } = req.body;

  let cart = await Cart.findOne({ userId });
  let item = await Item.findOne({ _id: productId });

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  if (!cart) {
    res.status(400);
    throw new Error('Cart not found');
  } else {
    let itemIndex = cart.items.findIndex(p => p.productId == productId);

    //check if product exist or not
    if (itemIndex == -1) {
      res.status(404);
      throw new Error('Item not found in cart');
    } else {
      let productItem = cart.items[itemIndex];
      productItem.quantity = qty;
      cart.items[itemIndex] = productItem;
    }
    cart.bill = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart = await cart.save();
    return res.status(201).json(cart);
  }
});

module.exports.deleteCartItem = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.itemId;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  let itemIndex = cart.items.findIndex(p => p.productId == productId);

  if (itemIndex > -1) {
    let productItem = cart.items[itemIndex];
    cart.bill -= productItem.quantity * productItem.price;
    cart.items.splice(itemIndex, 1);
  }
  cart = await cart.save();
  return res.status(201).json(cart);
});
