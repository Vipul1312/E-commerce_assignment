import { useApp } from '../context/AppContext';
import ProductCard from '../components/product/ProductCard';
import { CATEGORIES } from '../data/products';

export default function ShopPage() {
  const { products, selectedCategory, setSelectedCategory, searchQuery, sortBy, setSortBy, priceRange, setPriceRange } = useApp();

  const filtered = products.filter(p => {
    const matchCat    = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPrice  = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchCat && matchSearch && matchPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-asc')  return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating')     return b.rating - a.rating;
    if (sortBy === 'newest')     return b._id - a._id;
    return b.featured - a.featured;
  });

  return (
    <div className="section" style={{ paddingTop: 120 }}>
      <div className="section-header">
        <div className="section-eyebrow">Shop</div>
        <div className="section-flex">
          <h1 className="section-title">All Products <span style={{ fontSize: '0.5em', color: 'var(--ink-muted)', fontWeight: 400 }}>({filtered.length})</span></h1>
        </div>
      </div>

      <div className="cat-pills">
        {CATEGORIES.map(cat => (
          <div key={cat} className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)}>{cat}</div>
        ))}
      </div>

      <div className="shop-layout">
        {/* Filter Sidebar */}
        <div className="filter-panel">
          <div className="filter-title">Filters</div>
          <div className="filter-section">
            <div className="filter-label">Sort By</div>
            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div className="filter-section">
            <div className="filter-label">Price Range</div>
            <div className="price-range">
              <input type="range" min="0" max="2000" value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])} />
              <div className="price-range-labels"><span>$0</span><span>Up to ${priceRange[1].toLocaleString()}</span></div>
            </div>
          </div>
          <div className="filter-section">
            <div className="filter-label">Category</div>
            {CATEGORIES.filter(c => c !== 'All').map(cat => (
              <div key={cat} className="filter-option">
                <input type="radio" id={cat} name="cat" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} />
                <label htmlFor={cat}>{cat}</label>
              </div>
            ))}
          </div>
          <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { setSelectedCategory('All'); setPriceRange([0, 2000]); setSortBy('featured'); }}>
            Clear Filters
          </button>
        </div>

        {/* Product Grid */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--ink-muted)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No products found</div>
              <div>Try adjusting your filters or search query</div>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
