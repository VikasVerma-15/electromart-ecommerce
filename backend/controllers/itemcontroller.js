const Item = require('../models/item');
const asyncHandler = require('express-async-handler');

// Get all items with filtering (no pagination)
module.exports.getItems = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const filters = { ...keyword, ...category, isActive: true };

  const items = await Item.find(filters)
    .sort({ createdAt: -1 });

  res.json({
    items,
    total: items.length,
  });
});

// Get single item by ID
module.exports.getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// Create new item (Admin only)
module.exports.createItem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    stock,
    images,
    brand
  } = req.body;

  const item = await Item.create({
    title,
    description,
    price,
    category,
    stock,
    images,
    brand
  });

  if (item) {
    res.status(201).json(item);
  } else {
    res.status(400);
    throw new Error('Invalid item data');
  }
});

// Update item (Admin only)
module.exports.updateItem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    stock,
    images,
    brand,
    isActive
  } = req.body;

  const item = await Item.findById(req.params.id);

  if (item) {
    item.title = title || item.title;
    item.description = description || item.description;
    item.price = price || item.price;
    item.category = category || item.category;
    item.stock = stock !== undefined ? stock : item.stock;
    item.images = images || item.images;
    item.brand = brand || item.brand;
    item.isActive = isActive !== undefined ? isActive : item.isActive;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// Delete item (Admin only)
module.exports.deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// Get top rated items
module.exports.getTopItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ isActive: true })
    .sort({ rating: -1 })
    .limit(5);

  res.json(items);
});

// Get items by category
module.exports.getItemsByCategory = asyncHandler(async (req, res) => {
  const items = await Item.find({ 
    category: req.params.category,
    isActive: true 
  });

  res.json(items);
});
