import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CATEGORIES } from '../data/products';

export default function AdminPage() {
  const { adminSection, setAdminSection, products, loadProducts, editProduct, setEditProduct, notify } = useApp();
  const [productForm, setProductForm] = useState({ name: '', price: '', originalPrice: '', category: 'Watches', description: '', image: '⌚', stock: '', badge: '' });
  const [showForm, setShowForm] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [dashStats, setDashStats] = useState(null);

  const loadAdminData = async () => {
    try {
      if (adminSection === 'dashboard') {
        const data = await api.getDashboardStats();
        setDashStats(data.stats);
        setAllOrders(data.recentOrders || []);
      } else if (adminSection === 'orders') {
        const data = await api.getAllOrders();
        setAllOrders(data.orders || []);
      } else if (adminSection === 'customers') {
        const data = await api.getAllCustomers();
        setAllCustomers(data.customers || []);
      }
    } catch (err) {
      notify(err.message || 'Failed to load data', 'error');
    }
  };

  useEffect(() => { loadAdminData(); }, [adminSection]);

  useEffect(() => {
    if (editProduct) {
      setProductForm({ ...editProduct, price: String(editProduct.price), originalPrice: String(editProduct.originalPrice), stock: String(editProduct.stock) });
      setShowForm(true);
      setAdminSection('products');
    }
  }, [editProduct]);

  const handleProductSave = async () => {
    if (!productForm.name || !productForm.price) return notify('Please fill required fields', 'error');
    const product = { ...productForm, price: parseFloat(productForm.price), originalPrice: parseFloat(productForm.originalPrice || productForm.price), stock: parseInt(productForm.stock) || 0 };
    try {
      if (editProduct) {
        await api.updateProduct(editProduct._id, product);
        notify('Product updated! ✓');
      } else {
        await api.createProduct(product);
        notify('Product added! ✓');
      }
      await loadProducts();
      setShowForm(false);
      setEditProduct(null);
      setProductForm({ name: '', price: '', originalPrice: '', category: 'Watches', description: '', image: '⌚', stock: '', badge: '' });
    } catch (err) {
      notify(err.message || 'Failed to save product', 'error');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setAllOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      notify(`Order → ${newStatus} ✓`);
    } catch (err) {
      notify(err.message || 'Status update failed', 'error');
    }
  };

  const navItems = [['dashboard', '📊', 'Dashboard'], ['products', '📦', 'Products'], ['orders', '🛒', 'Orders'], ['customers', '👥', 'Customers']];

  return (
    <div style={{ paddingTop: 72 }}>
      <div className="admin-layout">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="admin-brand">
            <div className="admin-brand-title">LUXE Admin</div>
            <div className="admin-brand-sub">Management Console</div>
          </div>
          <div className="admin-nav-section">
            <div className="admin-nav-label">Navigation</div>
            {navItems.map(([id, icon, label]) => (
              <button key={id} className={`admin-nav-item ${adminSection === id ? 'active' : ''}`} onClick={() => setAdminSection(id)}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">

          {/* Dashboard */}
          {adminSection === 'dashboard' && (
            <>
              <div className="admin-header">
                <div className="admin-title">Dashboard</div>
                <div className="admin-sub">Live overview of your store activity.</div>
              </div>
              <div className="stats-grid">
                {[['📦', 'Total Products', dashStats?.totalProducts ?? products.length, 'Active listings'],
                  ['🛒', 'Total Orders', dashStats?.totalOrders ?? allOrders.length, 'From real customers'],
                  ['💰', 'Revenue', '$' + (dashStats?.totalRevenue ?? 0).toLocaleString(), 'All time'],
                  ['👥', 'Customers', dashStats?.totalCustomers ?? allCustomers.length, 'Registered users']
                ].map(([icon, label, val, change]) => (
                  <div key={label} className="stat-card">
                    <div className="stat-card-icon">{icon}</div>
                    <div className="stat-card-label">{label}</div>
                    <div className="stat-card-val">{val}</div>
                    <div className="stat-card-change">{change}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--white)', borderRadius: 20, padding: 28, border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Recent Orders</div>
                {allOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--ink-muted)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>No orders yet</div>
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                      <tbody>
                        {allOrders.slice(0, 10).map(o => (
                          <tr key={o._id}>
                            <td style={{ fontWeight: 700 }}>{o._id?.slice(-8)}</td>
                            <td>{o.user?.name || '—'}</td>
                            <td>{o.items?.length} item{o.items?.length > 1 ? 's' : ''}</td>
                            <td style={{ fontFamily: 'var(--ff-display)', fontSize: 16 }}>${o.total?.toLocaleString()}</td>
                            <td><span className={`status-badge ${o.status?.toLowerCase()}`}>{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Products */}
          {adminSection === 'products' && (
            <>
              <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div className="admin-title">Products</div>
                  <div className="admin-sub">{products.length} products in catalog</div>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditProduct(null); setProductForm({ name: '', price: '', originalPrice: '', category: 'Watches', description: '', image: '⌚', stock: '', badge: '' }); setShowForm(!showForm); }}>
                  {showForm ? 'Cancel' : '+ Add Product'}
                </button>
              </div>
              {showForm && (
                <div className="checkout-card" style={{ marginBottom: 32, borderRadius: 20 }}>
                  <div className="checkout-section-title">{editProduct ? 'Edit Product' : 'Add New Product'}</div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Product Name *</label><input className="form-input" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Premium Leather Watch" /></div>
                    <div className="form-group"><label className="form-label">Category</label>
                      <select className="form-input" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Price *</label><input className="form-input" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="299" /></div>
                    <div className="form-group"><label className="form-label">Original Price</label><input className="form-input" type="number" value={productForm.originalPrice} onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })} placeholder="399" /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Stock</label><input className="form-input" type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} placeholder="50" /></div>
                    <div className="form-group"><label className="form-label">Emoji Icon</label><input className="form-input" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} placeholder="⌚" /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} style={{ resize: 'vertical' }} /></div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-primary" onClick={handleProductSave}>{editProduct ? 'Save Changes' : 'Add Product'}</button>
                    <button className="btn btn-outline" onClick={() => { setShowForm(false); setEditProduct(null); }}>Cancel</button>
                  </div>
                </div>
              )}
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 28 }}>{p.image}</span><div><div style={{ fontWeight: 600 }}>{p.name}</div></div></div></td>
                        <td>{p.category}</td>
                        <td><span style={{ fontFamily: 'var(--ff-display)', fontSize: 16 }}>${p.price}</span></td>
                        <td><span style={{ color: p.stock < 10 ? '#ef4444' : '#10b981', fontWeight: 600 }}>{p.stock}</span></td>
                        <td>
                          <div className="admin-actions">
                            <button className="btn-edit" onClick={() => setEditProduct(p)}>Edit</button>
                            <button className="btn-del" onClick={async () => { try { await api.deleteProduct(p._id); await loadProducts(); notify('Product deleted', 'error'); } catch (e) { notify(e.message, 'error'); } }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Orders */}
          {adminSection === 'orders' && (
            <>
              <div className="admin-header">
                <div className="admin-title">Orders</div>
                <div className="admin-sub">{allOrders.length} total orders</div>
              </div>
              {allOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--white)', borderRadius: 20, border: '1px solid var(--border)', color: 'var(--ink-muted)' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>No orders yet</div>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
                    <tbody>
                      {allOrders.map(o => (
                        <tr key={o._id}>
                          <td style={{ fontWeight: 700 }}>{o._id?.slice(-8)}</td>
                          <td>{o.user?.name || '—'}</td>
                          <td>{o.items?.length} item{o.items?.length > 1 ? 's' : ''}</td>
                          <td style={{ fontFamily: 'var(--ff-display)', fontSize: 16 }}>${o.total?.toLocaleString()}</td>
                          <td><span className={`status-badge ${o.status?.toLowerCase()}`}>{o.status}</span></td>
                          <td>
                            <select className="sort-select" style={{ width: 'auto', fontSize: 12, padding: '6px 10px' }} value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)}>
                              {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Customers */}
          {adminSection === 'customers' && (
            <>
              <div className="admin-header">
                <div className="admin-title">Customers</div>
                <div className="admin-sub">{allCustomers.length} registered customers</div>
              </div>
              {allCustomers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--white)', borderRadius: 20, border: '1px solid var(--border)', color: 'var(--ink-muted)' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>👥</div>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>No customers yet</div>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>Customer</th><th>Email</th><th>Orders</th><th>Total Spent</th><th>Status</th></tr></thead>
                    <tbody>
                      {allCustomers.map(c => (
                        <tr key={c.email}>
                          <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--gold),var(--gold-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 15, flexShrink: 0 }}>{c.name.charAt(0).toUpperCase()}</div><span style={{ fontWeight: 600 }}>{c.name}</span></div></td>
                          <td style={{ color: 'var(--ink-muted)' }}>{c.email}</td>
                          <td>{c.orderCount} order{c.orderCount !== 1 ? 's' : ''}</td>
                          <td style={{ fontFamily: 'var(--ff-display)', fontSize: 18 }}>${c.spent?.toLocaleString()}</td>
                          <td><span className={`status-badge ${c.orderCount > 0 ? 'delivered' : 'processing'}`}>{c.orderCount > 0 ? 'Active' : 'Registered'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
