const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, required: true, min: 0 },
  category:      { type: String, required: true, enum: ['Watches','Footwear','Accessories','Eyewear','Clothing','Electronics','Bags','Kitchen','Home'] },
  description:   { type: String, default: '' },
  image:         { type: String, default: '📦' },
  badge:         { type: String, default: '' },
  stock:         { type: Number, default: 0, min: 0 },
  rating:        { type: Number, default: 4.5, min: 0, max: 5 },
  reviews:       { type: Number, default: 0 },
  featured:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
