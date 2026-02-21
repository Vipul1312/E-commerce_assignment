const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     String,
    image:    String,
    price:    Number,
    qty:      Number,
  }],
  shippingAddress: {
    name: String, email: String, phone: String,
    address: String, city: String, state: String, zip: String, country: String,
  },
  paymentMethod:    { type: String, enum: ['card','razorpay','cod'], default: 'card' },
  paymentStatus:    { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  razorpayOrderId:  { type: String, default: '' },
  razorpayPaymentId:{ type: String, default: '' },
  subtotal:         { type: Number, required: true },
  shippingCost:     { type: Number, default: 15 },
  tax:              { type: Number, default: 0 },
  total:            { type: Number, required: true },
  status: {
    type: String,
    enum: ['Processing','Shipped','Delivered','Cancelled'],
    default: 'Processing',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
