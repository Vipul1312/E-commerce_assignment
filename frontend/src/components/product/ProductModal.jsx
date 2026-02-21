import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct, addToCart, toggleWishlist, wishlist } = useApp();
  const [qty, setQty] = useState(1);

  if (!selectedProduct) return null;
  const p = selectedProduct;
  const wished = wishlist.find(i => i._id === p._id);
  const discount = Math.round((1 - p.price / p.originalPrice) * 100);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedProduct(null)}>
      <div className="modal" style={{ position: 'relative', maxWidth: 700 }}>
        <button className="modal-close" onClick={() => setSelectedProduct(null)}>✕</button>
        <div className="prod-modal-img">
          <span>{p.image}</span>
          {p.badge && <div className={`product-badge ${p.badge.toLowerCase()}`}>{p.badge}</div>}
        </div>
        <div className="prod-modal-body">
          <div className="product-category">{p.category}</div>
          <div className="prod-modal-title">{p.name}</div>
          <div className="product-rating">
            <span className="product-rating-stars">{'★'.repeat(Math.floor(p.rating))}</span>
            <span>{p.rating} ({p.reviews} reviews)</span>
          </div>
          <div className="prod-modal-price-row">
            <span className="product-price-current">${p.price.toLocaleString()}</span>
            <span className="product-price-original">${p.originalPrice.toLocaleString()}</span>
            <span className="product-price-save">Save {discount}%</span>
          </div>
          <div className="prod-modal-desc">{p.description}</div>
          <div className="prod-modal-meta">
            <span>📦 In Stock ({p.stock})</span>
            <span>🚚 Free Shipping</span>
            <span>↩ 30-Day Returns</span>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div className="form-label" style={{ marginBottom: 12 }}>Quantity</div>
            <div className="qty-control">
              <button className="qty-btn" style={{ width: 36, height: 36 }} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span style={{ fontSize: 18, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{qty}</span>
              <button className="qty-btn" style={{ width: 36, height: 36 }} onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
          <div className="prod-modal-actions">
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => { addToCart(p, qty); setSelectedProduct(null); }}>Add to Cart</button>
            <button className="btn btn-outline" onClick={() => toggleWishlist(p)} style={{ padding: '12px 20px', fontSize: 20 }}>
              {wished ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
