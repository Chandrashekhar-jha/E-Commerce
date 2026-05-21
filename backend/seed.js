const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Product = require('./model/product');
const User = require('./model/User');

dotenv.config();

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Comfortable over-ear headphones with active noise cancellation.',
    price: 119.99,
    category: 'Electronics',
    stock: 35,
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Headphones'
  },
  {
    name: 'Stainless Steel Coffee Maker',
    description: 'Programmable drip coffee maker with 12-cup capacity and auto shutoff.',
    price: 64.5,
    category: 'Home Appliances',
    stock: 20,
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Coffee+Maker'
  },
  {
    name: 'Fitness Running Shoes',
    description: 'Lightweight cushioned running shoes designed for daily training.',
    price: 79.99,
    category: 'Sportswear',
    stock: 50,
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Running+Shoes'
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Water-resistant smartwatch with heart-rate monitor and sleep tracking.',
    price: 149.0,
    category: 'Wearables',
    stock: 18,
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Smartwatch'
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Adjustable mesh-back chair for all-day support and comfort.',
    price: 189.95,
    category: 'Furniture',
    stock: 12,
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Office+Chair'
  },
  {
    name: 'Leather Wallet',
    description: 'Slim genuine leather wallet with multiple card slots and ID window.',
    price: 29.99,
    category: 'Accessories',
    stock: 80,
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Wallet'
  },
  {
    name: 'Portable Phone Charger',
    description: 'High-capacity power bank with fast charging and dual USB ports.',
    price: 39.99,
    category: 'Electronics',
    stock: 45,
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Power+Bank'
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for exercise, pilates, and stretching routines.',
    price: 24.95,
    category: 'Fitness',
    stock: 70,
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Yoga+Mat'
  },
  {
    name: 'Noise Cancelling Earbuds',
    description: 'True wireless earbuds with noise cancellation and long battery life.',
    price: 89.99,
    category: 'Electronics',
    stock: 28,
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Earbuds'
  },
  {
    name: 'Classic Desk Lamp',
    description: 'LED desk lamp with adjustable head and brightness levels.',
    price: 45.0,
    category: 'Home Decor',
    stock: 25,
    imageUrl: 'https://via.placeholder.com/300x300.png?text=Desk+Lamp'
  }
];

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'User1234!',
    role: 'user'
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'User1234!',
    role: 'user'
  },
  {
    name: 'Bob Admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin'
  },
  {
    name: 'Alice Manager',
    email: 'manager@example.com',
    password: 'Manager123!',
    role: 'user'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();

    console.log('Cleared existing data');

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
        verified: true
      }))
    );

    const insertedUsers = await User.insertMany(hashedUsers);
    const insertedProducts = await Product.insertMany(products);

    console.log(`✔ Seeded ${insertedUsers.length} users`);
    console.log(`✔ Seeded ${insertedProducts.length} products`);
    console.log('\nDatabase seeded successfully!');
    console.log('Login Credentials:');
    console.log('Admin: admin@example.com / Admin123!');
    console.log('User: john@example.com / User1234!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
  