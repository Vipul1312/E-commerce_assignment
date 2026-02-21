import { useApp } from '../../context/AppContext';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, removeFromCart, updateQty, cartTotal, setPage } = useApp();
  if (!cartOpen) return null;

  return (
    <div className="cart-overlay" onClick={e => e.target === e.currentTarget && setCartOpen(false)}>
      <div className="cart-drawer">
        <div className="cart-header">
          <div className="cart-title font-display">Your Cart</div>
          <button className="btn btn-ghost btn-icon" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Your cart is empty</div>
              <div style={{ fontSize: 14, color: 'var(--ink-muted)' }}>Add some beautiful products to get started</div>
              <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => { setPage('shop'); setCartOpen(false); }}>Shop Now</button>
            </div>
          ) : cart.map(item => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-emoji">{item.image}</div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">${(item.price * item.qty).toLocaleString()}</div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => removeFromCart(item._id)} style={{ fontSize: 16, color: 'var(--ink-muted)' }}>🗑</button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <div className="cart-total-label">Total ({cart.reduce((s, i) => s + i.qty, 0)} items)</div>
              <div className="cart-total-val">${cartTotal.toLocaleString()}</div>
            </div>
            <button className="btn btn-gold btn-lg" style={{ width: '100%', marginBottom: 10 }}
              onClick={() => { setPage('checkout'); setCartOpen(false); }}>
              Proceed to Checkout →
            </button>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setCartOpen(false)}>Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
}
