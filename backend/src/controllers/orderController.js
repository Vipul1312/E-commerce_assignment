const Order = require('../models/Order');
const Product = require('../models/Product');
const crypto = require('crypto');

let razorpay = null;

// Initialize Razorpay only if credentials are available
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  const Razorpay = require('razorpay');
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @POST /api/orders/razorpay-order — create Razorpay order
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ success: false, message: 'Razorpay not configured' });
    }
    const { amount } = req.body; // amount in INR
    const options = {
      amount: Math.round(amount * 100), // paise mein
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// @POST /api/orders — place order after payment
exports.placeOrder = async (req, res, next) => {
  try {
    const {
      items, shippingAddress, paymentMethod,
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
      subtotal, shippingCost, tax, total,
    } = req.body;

    // Razorpay signature verify karo (agar razorpay payment hai)
    if (paymentMethod === 'razorpay') {
      if (!razorpay) {
        return res.status(503).json({ success: false, message: 'Razorpay not configured' });
      }
      const sign = razorpayOrderId + '|' + razorpayPaymentId;
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest('hex');
      if (expected !== razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    }

    // Stock check + reduce karo
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      if (product.stock < item.qty) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      product.stock -= item.qty;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
      razorpayOrderId: razorpayOrderId || '',
      razorpayPaymentId: razorpayPaymentId || '',
      subtotal,
      shippingCost,
      tax,
      total,
    });

    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
};

// @GET /api/orders/my — logged in user ke orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) { next(err); }
};

// @GET /api/orders/:id — single order
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    // Sirf apna order dekh sakta hai (admin sab dekh sakta hai)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// @GET /api/orders — all orders (admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    res.json({ success: true, count: orders.length, totalRevenue, orders });
  } catch (err) { next(err); }
};

// @PUT /api/orders/:id/status — update status (admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) { next(err); }
};
