import { useApp } from '../../context/AppContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist, setSelectedProduct } = useApp();
  const wished = wishlist.find(i => i._id === product._id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="product-card" onClick={() => setSelectedProduct(product)}>
      <div className="product-card-img">
        <span>{product.image}</span>
        {product.badge && <div className={`product-badge ${product.badge.toLowerCase()}`}>{product.badge}</div>}
        <button className={`product-wish ${wished ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); toggleWishlist(product); }}>
          {wished ? '♥' : '♡'}
        </button>
      </div>
      <div className="product-card-body">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-rating">
          <span className="product-rating-stars">{'★'.repeat(Math.floor(product.rating))}</span>
          <span>{product.rating} ({product.reviews})</span>
        </div>
        <div className="product-price">
          <span className="product-price-current">${product.price.toLocaleString()}</span>
          <span className="product-price-original">${product.originalPrice.toLocaleString()}</span>
          {discount > 0 && <span className="product-price-save">-{discount}%</span>}
        </div>
        <div className="product-card-actions" onClick={e => e.stopPropagation()}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
