const Product = require('../models/Product');

// @GET /api/products — get all products with filters
exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price-asc')  sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating')     sortOption = { rating: -1 };
    if (sort === 'newest')     sortOption = { createdAt: -1 };
    if (!sort || sort === 'featured') sortOption = { featured: -1, createdAt: -1 };

    const products = await Product.find(query).sort(sortOption);
    res.json({ success: true, count: products.length, products });
  } catch (err) { next(err); }
};

// @GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

// @POST /api/products  (admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
};

// @PUT /api/products/:id  (admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

// @DELETE /api/products/:id  (admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { next(err); }
};
