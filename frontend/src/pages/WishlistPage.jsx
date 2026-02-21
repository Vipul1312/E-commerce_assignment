import { useApp } from '../context/AppContext';
import ProductCard from '../components/product/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useApp();
  return (
    <div className="section" style={{ paddingTop: 120 }}>
      <div className="section-header">
        <div className="section-eyebrow">Saved</div>
        <h1 className="section-title">Your Wishlist</h1>
      </div>
      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">♡</div>
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 32, marginBottom: 12 }}>Nothing saved yet</div>
          <div style={{ color: 'var(--ink-muted)', marginBottom: 24 }}>Heart products you love to save them here</div>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
