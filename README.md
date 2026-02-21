# LUXE — Premium E-Commerce Platform

A full-stack luxury e-commerce application built with React (frontend) and Node.js/Express/MongoDB (backend).

## Tech Stack

**Frontend:** React 18, Context API, CSS Variables  
**Backend:** Node.js, Express.js, MongoDB (Mongoose)  
**Auth:** JWT (JSON Web Tokens) + bcrypt  
**Payments:** Razorpay integration

---

## Project Structure

```
luxe-fullstack/
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.js              # MongoDB connection
│       ├── controllers/
│       │   ├── authController.js  # Register, login, profile
│       │   ├── productController.js
│       │   ├── orderController.js
│       │   └── adminController.js
│       ├── middleware/
│       │   ├── auth.js            # JWT protect + adminOnly
│       │   └── errorHandler.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Product.js
│       │   └── Order.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── productRoutes.js
│       │   ├── orderRoutes.js
│       │   └── adminRoutes.js
│       ├── utils/
│       │   └── seed.js            # Database seeder
│       └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   │   └── AuthModal.jsx  # Login / Signup / Forgot Password
│       │   ├── cart/
│       │   │   └── CartDrawer.jsx
│       │   ├── common/
│       │   │   └── Notification.jsx
│       │   ├── layout/
│       │   │   ├── Navbar.jsx
│       │   │   └── Footer.jsx
│       │   ├── product/
│       │   │   ├── ProductCard.jsx
│       │   │   └── ProductModal.jsx
│       │   └── index.js           # Central export
│       ├── context/
│       │   └── AppContext.jsx     # Global state (user, cart, etc.)
│       ├── data/
│       │   └── products.js        # Category constants
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── ShopPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── WishlistPage.jsx
│       │   ├── LookbookPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── AdminPage.jsx
│       │   └── index.js           # Central export
│       ├── services/
│       │   └── api.js             # All API calls (fetch wrapper)
│       ├── styles/
│       │   └── index.css          # Global styles + CSS variables
│       ├── App.jsx
│       └── index.jsx
│
├── .gitignore
├── package.json                   # Root scripts (run both servers)
└── README.md
```

---

## Quick Start

### 1. Install dependencies
```bash
npm run install-all
```

### 2. Configure environment

**backend/.env**
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/luxe_db
JWT_SECRET=your_secret_key_here
PORT=5000
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
CLIENT_URL=http://localhost:3000
```

**frontend/.env**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxx
```

### 3. Seed the database
```bash
npm run seed
```
This creates 12 products and an admin user:
- **Email:** admin@luxe.com  
- **Password:** Admin@123

### 4. Run the app
```bash
npm run dev
```
- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000

---

## API Endpoints

| Method | Endpoint                    | Auth       | Description          |
|--------|-----------------------------|------------|----------------------|
| POST   | /api/auth/register          | Public     | Create account       |
| POST   | /api/auth/login             | Public     | Login                |
| GET    | /api/auth/me                | User       | Get current user     |
| PUT    | /api/auth/update-profile    | User       | Update profile       |
| GET    | /api/products               | Public     | Get all products     |
| POST   | /api/products               | Admin      | Create product       |
| PUT    | /api/products/:id           | Admin      | Update product       |
| DELETE | /api/products/:id           | Admin      | Delete product       |
| POST   | /api/orders                 | User       | Place order          |
| GET    | /api/orders/my              | User       | My orders            |
| GET    | /api/orders                 | Admin      | All orders           |
| PUT    | /api/orders/:id/status      | Admin      | Update order status  |
| GET    | /api/admin/dashboard        | Admin      | Dashboard stats      |
| GET    | /api/admin/users            | Admin      | All customers        |

---

## Features

- ✅ User authentication (JWT)
- ✅ Product catalog with filters & search
- ✅ Shopping cart & wishlist
- ✅ Multi-step checkout
- ✅ Order management
- ✅ Admin dashboard (products, orders, customers)
- ✅ Responsive design
- ✅ Lookbook page
- ✅ Password strength validation
- ✅ Stock management
- ✅ Razorpay payment integration
