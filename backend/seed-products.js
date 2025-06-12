const mongoose = require('mongoose');
const Item = require('./models/item');
require('dotenv').config();

const sampleProducts = [
  {
    title: 'Samsung 55" 4K Smart TV',
    description: 'Crystal UHD 4K Smart TV with Alexa Built-in',
    price: 58099.17,
    category: 'Electronics',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'],
    rating: 4.5,
    numReviews: 128,
    brand: 'Samsung',
  },
  {
    title: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with A17 Pro chip and titanium design',
    price: 99599.17,
    category: 'Mobile',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
    rating: 4.8,
    numReviews: 256,
    brand: 'Apple',
  },
  {
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones',
    price: 33199.17,
    category: 'Audio',
    stock: 22,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    rating: 4.7,
    numReviews: 89,
    brand: 'Sony',
  },
  {
    title: 'MacBook Pro 16" M3',
    description: 'Powerful laptop with M3 chip for professionals',
    price: 207499.17,
    category: 'Computers',
    stock: 5,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    rating: 4.9,
    numReviews: 67,
    brand: 'Apple',
  },
  {
    title: 'Dyson V15 Detect Vacuum',
    description: 'Cordless vacuum with laser dust detection',
    price: 62249.17,
    category: 'Electronics',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'],
    rating: 4.6,
    numReviews: 156,
    brand: 'Dyson',
  },
  {
    title: 'Nintendo Switch OLED',
    description: 'Handheld gaming console with 7-inch OLED screen',
    price: 29049.17,
    category: 'Gaming',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400'],
    rating: 4.4,
    numReviews: 203,
    brand: 'Nintendo',
  },
  {
    title: 'Canon EOS R5 Camera',
    description: 'Mirrorless camera with 45MP full-frame sensor',
    price: 323699.17,
    category: 'Electronics',
    stock: 3,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    rating: 4.8,
    numReviews: 45,
    brand: 'Canon',
  },
  {
    title: 'LG 27" 4K Monitor',
    description: 'Ultra-wide curved gaming monitor with HDR',
    price: 49799.17,
    category: 'Computers',
    stock: 9,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'],
    rating: 4.3,
    numReviews: 78,
    brand: 'LG',
  },
  {
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Premium smartphone with S Pen and AI features',
    price: 107899.17,
    category: 'Mobile',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
    rating: 4.7,
    numReviews: 89,
    brand: 'Samsung',
  },
  {
    title: 'Dell XPS 13 Laptop',
    description: 'Ultra-portable laptop with InfinityEdge display',
    price: 107899.17,
    category: 'Computers',
    stock: 7,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    rating: 4.6,
    numReviews: 156,
    brand: 'Dell',
  },
  {
    title: 'Bose QuietComfort 45',
    description: 'Premium noise-canceling headphones',
    price: 27389.17,
    category: 'Audio',
    stock: 14,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    rating: 4.5,
    numReviews: 234,
    brand: 'Bose',
  },
  {
    title: 'PlayStation 5 Console',
    description: 'Next-gen gaming console with ray tracing',
    price: 41499.17,
    category: 'Gaming',
    stock: 6,
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400'],
    rating: 4.8,
    numReviews: 567,
    brand: 'Sony',
  },
  {
    title: 'iPad Pro 12.9" M2',
    description: 'Professional tablet with M2 chip',
    price: 91299.17,
    category: 'Mobile',
    stock: 11,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
    rating: 4.7,
    numReviews: 123,
    brand: 'Apple',
  },
  {
    title: 'ASUS ROG Gaming Laptop',
    description: 'High-performance gaming laptop with RTX graphics',
    price: 157699.17,
    category: 'Computers',
    stock: 4,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    rating: 4.4,
    numReviews: 78,
    brand: 'ASUS',
  },
  {
    title: 'JBL Charge 5 Speaker',
    description: 'Portable Bluetooth speaker with 20-hour battery',
    price: 14939.17,
    category: 'Audio',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    rating: 4.3,
    numReviews: 189,
    brand: 'JBL',
  },
  {
    title: 'Xbox Series X Console',
    description: 'Most powerful Xbox with 4K gaming',
    price: 41499.17,
    category: 'Gaming',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400'],
    rating: 4.6,
    numReviews: 345,
    brand: 'Microsoft',
  },
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Item.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const insertedProducts = await Item.insertMany(sampleProducts);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Display the products
    console.log('\n📦 Sample Products Added:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - $${product.price}`);
    });

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedProducts(); 