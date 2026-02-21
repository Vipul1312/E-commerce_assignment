import { useApp } from '../context/AppContext';
import ProductCard from '../components/product/ProductCard';

export default function HomePage() {
  const { setPage, setSelectedProduct, products } = useApp();
  const featured = products.filter(p => p.featured).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-glow" />
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">✦ Premium Collection 2025</div>
            <h1 className="hero-title">Curated for<br /><em>Refined</em><br />Taste</h1>
            <p className="hero-sub">Discover an exceptional collection of premium goods — each piece selected for its craftsmanship, design, and enduring quality.</p>
            <div className="hero-btns">
              <button className="btn btn-gold btn-lg" onClick={() => setPage('shop')}>Shop Collection →</button>
              <button className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => setPage('lookbook')}>View Lookbook</button>
            </div>
            <div className="hero-stats">
              {[['2,500+', 'Premium Products'], ['98%', 'Customer Satisfaction'], ['50k+', 'Happy Customers']].map(([v, l]) => (
                <div key={l}>
                  <div className="hero-stat-val">{v}</div>
                  <div className="hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            {featured.map(p => (
              <div key={p._id} className="hero-card" onClick={() => setSelectedProduct(p)}>
                <div className="hero-card-emoji">{p.image}</div>
                <div>
                  <div className="hero-card-name">{p.name}</div>
                  <div className="hero-card-price">${p.price.toLocaleString()} — {p.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="trust-inner">
          {[['🚚', 'Free Shipping', 'On orders over $100'], ['🔒', 'Secure Payments', '256-bit SSL encryption'], ['↩', '30-Day Returns', 'Hassle-free returns'], ['⭐', 'Premium Quality', 'Curated selection']].map(([icon, label, sub]) => (
            <div key={label} className="trust-item">
              <div className="trust-icon">{icon}</div>
              <div>
                <div className="trust-label">{label}</div>
                <div className="trust-sub">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="section">
        <div className="section-flex section-header">
          <div>
            <div className="section-eyebrow">Featured</div>
            <h2 className="section-title">Handpicked for You</h2>
          </div>
          <button className="btn btn-outline" onClick={() => setPage('shop')}>View All →</button>
        </div>
        <div className="product-grid">
          {products.filter(p => p.featured).map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>

      {/* Sale Banner */}
      <div className="banner" style={{ maxWidth: 1400, margin: '0 auto', marginBottom: 0 }}>
        <div className="banner-bg" />
        <div className="banner-inner">
          <div>
            <h2 className="banner-title">End of Season Sale<br />Up to 40% Off</h2>
            <p className="banner-sub">Limited time offer on our premium collection. Don't miss out on these exceptional deals.</p>
            <button className="btn btn-primary btn-lg" onClick={() => setPage('shop')}>Shop the Sale →</button>
          </div>
          <div className="banner-emoji">🛍</div>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="section">
        <div className="section-flex section-header">
          <div>
            <div className="section-eyebrow">Catalog</div>
            <h2 className="section-title">New Arrivals</h2>
          </div>
        </div>
        <div className="product-grid">
          {products.filter(p => !p.featured).slice(0, 6).map(p => <ProductCard key={p._id} product={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button className="btn btn-outline btn-lg" onClick={() => setPage('shop')}>Browse All Products</button>
        </div>
      </div>
    </div>
  );
}
