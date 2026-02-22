require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

const products = [
  { name:'Arc Titanium Chronograph',   price:1299, originalPrice:1599, category:'Watches',     image:'⌚', badge:'Best Seller', stock:15, featured:true,  rating:4.9, reviews:234, description:'Swiss movement, 42mm titanium case, sapphire crystal glass.' },
  { name:'Obsidian Leather Sneakers',  price:289,  originalPrice:389,  category:'Footwear',    image:'👟', badge:'New',         stock:8,  featured:true,  rating:4.7, reviews:189, description:'Full-grain leather upper, memory foam insole.' },
  { name:'Carbon Fiber Wallet',        price:149,  originalPrice:199,  category:'Accessories', image:'👜', badge:'Sale',        stock:25, featured:false, rating:4.8, reviews:412, description:'Ultra-thin RFID blocking wallet, holds 12 cards.' },
  { name:'Matte Black Sunglasses',     price:199,  originalPrice:249,  category:'Eyewear',     image:'🕶️',badge:'',           stock:12, featured:true,  rating:4.6, reviews:156, description:'Polarized lenses, lightweight TR90 frame, UV400.' },
  { name:'Merino Wool Turtleneck',     price:179,  originalPrice:229,  category:'Clothing',    image:'👕', badge:'Trending',    stock:20, featured:false, rating:4.8, reviews:298, description:'100% Australian merino wool.' },
  { name:'Phantom Wireless Earbuds',   price:349,  originalPrice:449,  category:'Electronics', image:'🎧', badge:'Hot',         stock:5,  featured:true,  rating:4.9, reviews:567, description:'ANC, 30hr battery, IPX5 water resistant.' },
  { name:'Brushed Steel Flask',        price:79,   originalPrice:99,   category:'Accessories', image:'🧴', badge:'',            stock:30, featured:false, rating:4.7, reviews:223, description:'500ml vacuum insulated, keeps cold 24hr.' },
  { name:'Structured Canvas Tote',     price:129,  originalPrice:169,  category:'Bags',        image:'🧳', badge:'New',         stock:18, featured:false, rating:4.5, reviews:134, description:'Premium canvas, reinforced handles.' },
  { name:'Ceramic Pour-Over Set',      price:89,   originalPrice:119,  category:'Kitchen',     image:'☕', badge:'Sale',        stock:22, featured:false, rating:4.8, reviews:345, description:'Dripper, carafe, 40 filters included.' },
  { name:'Minimalist Desk Lamp',       price:219,  originalPrice:279,  category:'Home',        image:'💡', badge:'',            stock:14, featured:true,  rating:4.7, reviews:187, description:'Touch-sensitive, 5 brightness levels, USB-C.' },
  { name:'Slim Leather Belt',          price:99,   originalPrice:129,  category:'Accessories', image:'🔖', badge:'',            stock:28, featured:false, rating:4.6, reviews:201, description:'Full-grain leather, solid brass buckle.' },
  { name:'Ultralight Packable Jacket', price:249,  originalPrice:329,  category:'Clothing',    image:'🧥', badge:'Best Seller', stock:9,  featured:true,  rating:4.8, reviews:312, description:'Water-resistant, packs into its own pocket, 180g.' },
];

const seedDB = async () => {
  await connectDB();

  // Clear existing data
  await Product.deleteMany();
  await User.deleteMany({ role: 'admin' });

  // Insert products
  await Product.insertMany(products);
  console.log(`✅ ${products.length} products inserted`);

  // Create admin user
  await User.create({
    name: 'Admin',
    email: 'admin@luxe.com',
    password: 'Admin@123',
    role: 'admin',
  });
  console.log('✅ Admin user created: admin@luxe.com / Admin@123');

  console.log('🌱 Database seeded successfully!');
  process.exit(0);
};

seedDB().catch(err => { console.error(err); process.exit(1); });

exports.seedDatabase = async (req, res) => {
  await seedDB();
  res.json({ success: true, message: 'Database seeded!' });
};
```