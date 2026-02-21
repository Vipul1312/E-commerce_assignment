const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @GET /api/admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, orders] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
    ]);
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]);
    const revenue = totalRevenue[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders: await Order.countDocuments(),
        totalRevenue: revenue,
      },
      recentOrders: orders,
    });
  } catch (err) { next(err); }
};

// @GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    // Each user ke orders count aur total spent
    const usersWithStats = await Promise.all(users.map(async (u) => {
      const orders = await Order.find({ user: u._id });
      const spent = orders.reduce((s, o) => s + o.total, 0);
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        createdAt: u.createdAt,
        orderCount: orders.length,
        totalSpent: spent,
      };
    }));
    res.json({ success: true, users: usersWithStats });
  } catch (err) { next(err); }
};

// @DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};
