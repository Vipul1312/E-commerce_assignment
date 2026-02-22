require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const adminRoutes   = require('./routes/adminRoutes');

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/admin',    adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'LUXE API running ✅' }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
