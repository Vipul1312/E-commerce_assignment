import { useState, useCallback, useRef, createContext, useContext, useEffect } from 'react';
import { api } from '../services/api';

export const AppContext = createContext();

const PRODUCTS_FALLBACK = [
  { _id:'1', name:"Arc Titanium Chronograph",   price:1299, originalPrice:1599, category:"Watches",     rating:4.9, reviews:234, image:"⌚", badge:"Best Seller", stock:15, featured:true  },
  { _id:'2', name:"Obsidian Leather Sneakers",  price:289,  originalPrice:389,  category:"Footwear",    rating:4.7, reviews:189, image:"👟", badge:"New",         stock:8,  featured:true  },
  { _id:'3', name:"Carbon Fiber Wallet",        price:149,  originalPrice:199,  category:"Accessories", rating:4.8, reviews:412, image:"👜", badge:"Sale",        stock:25, featured:false },
  { _id:'4', name:"Matte Black Sunglasses",     price:199,  originalPrice:249,  category:"Eyewear",     rating:4.6, reviews:156, image:"🕶️",badge:"",            stock:12, featured:true  },
  { _id:'5', name:"Merino Wool Turtleneck",     price:179,  originalPrice:229,  category:"Clothing",    rating:4.8, reviews:298, image:"👕", badge:"Trending",    stock:20, featured:false },
  { _id:'6', name:"Phantom Wireless Earbuds",   price:349,  originalPrice:449,  category:"Electronics", rating:4.9, reviews:567, image:"🎧", badge:"Hot",         stock:5,  featured:true  },
  { _id:'7', name:"Brushed Steel Flask",        price:79,   originalPrice:99,   category:"Accessories", rating:4.7, reviews:223, image:"🧴", badge:"",            stock:30, featured:false },
  { _id:'8', name:"Structured Canvas Tote",     price:129,  originalPrice:169,  category:"Bags",        rating:4.5, reviews:134, image:"🧳", badge:"New",         stock:18, featured:false },
  { _id:'9', name:"Ceramic Pour-Over Set",      price:89,   originalPrice:119,  category:"Kitchen",     rating:4.8, reviews:345, image:"☕", badge:"Sale",        stock:22, featured:false },
  { _id:'10',name:"Minimalist Desk Lamp",       price:219,  originalPrice:279,  category:"Home",        rating:4.7, reviews:187, image:"💡", badge:"",            stock:14, featured:true  },
  { _id:'11',name:"Slim Leather Belt",          price:99,   originalPrice:129,  category:"Accessories", rating:4.6, reviews:201, image:"🔖", badge:"",            stock:28, featured:false },
  { _id:'12',name:"Ultralight Packable Jacket", price:249,  originalPrice:329,  category:"Clothing",    rating:4.8, reviews:312, image:"🧥", badge:"Best Seller", stock:9,  featured:true  },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState(null);
  const [page, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('featured');
  const [orders, setOrders] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [adminSection, setAdminSection] = useState('dashboard');
  const [products, setProducts] = useState(PRODUCTS_FALLBACK);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // App start hone par — token se user restore karo + products load karo
  useEffect(() => {
    const token = localStorage.getItem('luxe_token');
    const savedUser = localStorage.getItem('luxe_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    loadProducts();
  }, []);

  // ── Products API se load karo ──
  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch {
      // Fallback to hardcoded products if API fails
    }
  };

  // ── Auth Functions ──
  const loginUser = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('luxe_token', data.token);
    localStorage.setItem('luxe_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const registerUser = useCallback(async (name, email, password) => {
    const data = await api.register({ name, email, password });
    localStorage.setItem('luxe_token', data.token);
    localStorage.setItem('luxe_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem('luxe_token');
    localStorage.removeItem('luxe_user');
    setUser(null);
    setOrders([]);
    setCart([]);
    setPage('home');
  }, []);

  const updateUserProfile = useCallback(async (profileData) => {
    const data = await api.updateProfile(profileData);
    const updatedUser = { ...user, ...data.user };
    localStorage.setItem('luxe_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  }, [user]);

  // ── Orders ──
  const loadMyOrders = useCallback(async () => {
    try {
      const data = await api.getMyOrders();
      setOrders(data.orders || []);
    } catch {}
  }, []);

  // ── Notifications ──
  const notify = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  // ── Cart ──
  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    notify(`${product.name} added to cart`);
  }, [notify]);

  const removeFromCart = useCallback((id) => setCart(prev => prev.filter(i => i._id !== id)), []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) { setCart(prev => prev.filter(i => i._id !== id)); return; }
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  }, []);

  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) { notify('Removed from wishlist', 'info'); return prev.filter(i => i._id !== product._id); }
      notify('Added to wishlist ♥');
      return [...prev, product];
    });
  }, [notify]);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <AppContext.Provider value={{
      user, setUser, loginUser, registerUser, logoutUser, updateUserProfile,
      cart, setCart, addToCart, removeFromCart, updateQty, cartTotal, cartCount,
      wishlist, toggleWishlist, notification, notify,
      page, setPage, selectedProduct, setSelectedProduct,
      searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
      priceRange, setPriceRange, sortBy, setSortBy,
      orders, setOrders, loadMyOrders,
      cartOpen, setCartOpen, authModal, setAuthModal,
      checkoutStep, setCheckoutStep,
      adminSection, setAdminSection,
      products, setProducts, loadProducts,
      editProduct, setEditProduct, loading, setLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
