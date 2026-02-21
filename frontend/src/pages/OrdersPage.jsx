import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function OrdersPage() {
  const { user, setAuthModal, loadMyOrders, orders } = useApp();

  useEffect(() => {
    if (user) loadMyOrders();
  }, [user]);

  if (!user) return (
    <div className="section" style={{ paddingTop: 120, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: 36, marginBottom: 24 }}>Sign in to view orders</div>
      <button className="btn btn-primary btn-lg" onClick={() => setAuthModal('login')}>Sign In</button>
    </div>
  );

  return (
    <div className="section" style={{ paddingTop: 120 }}>
      <div className="section-header">
        <div className="section-eyebrow">Account</div>
        <h1 className="section-title">Your Orders</h1>
      </div>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--ink-muted)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 32, marginBottom: 12 }}>No orders yet</div>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <div className="order-id">{order._id}</div>
                  <div className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div className={`status-badge ${order.status?.toLowerCase()}`}>{order.status}</div>
              </div>
              <div className="order-items-list">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item-row">
                    <span>{item.name} × {item.qty}</span>
                    <span>${(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="order-total-summary">
                <span style={{ fontWeight: 600 }}>Order Total</span>
                <span style={{ fontFamily: 'var(--ff-display)', fontSize: 24, fontWeight: 700 }}>${order.total?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
