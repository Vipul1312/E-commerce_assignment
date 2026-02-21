import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Navbar({ scrolled }) {
  const { user, logoutUser, setPage, page, cartCount, setCartOpen, setAuthModal, searchQuery, setSearchQuery } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner">
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </div>
          <div className="nav-logo" onClick={() => setPage('home')}>
            <span>LUXE</span><div className="nav-logo-dot" />
          </div>
          <div className="nav-links">
            {['home', 'shop', 'wishlist'].map(p => (
              <button key={p} className={`nav-link ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
            {user && <button className={`nav-link ${page === 'orders' ? 'active' : ''}`} onClick={() => setPage('orders')}>Orders</button>}
            {user?.role === 'admin' && <button className={`nav-link ${page === 'admin' ? 'active' : ''}`} onClick={() => setPage('admin')}>Admin</button>}
          </div>
          <div className="nav-search">
            <span style={{ color: 'var(--ink-muted)' }}>🔍</span>
            <input placeholder="Search products..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage('shop'); }} />
          </div>
          <div className="nav-actions">
            {user ? (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => setPage('profile')}>👤 {user.name.split(' ')[0]}</button>
                <button className="btn btn-outline btn-sm" onClick={() => { logoutUser(); setPage('home'); }}>Logout</button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => setAuthModal('login')}>Login</button>
                <button className="btn btn-primary btn-sm" onClick={() => setAuthModal('signup')}>Sign Up</button>
              </>
            )}
            <div style={{ position: 'relative' }}>
              <button className="btn btn-ghost btn-icon" onClick={() => setCartOpen(true)}>🛒</button>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <button className="nav-logo" style={{ marginBottom: 16, justifyContent: 'flex-start' }} onClick={() => setPage('home')}>
            LUXE<div className="nav-logo-dot" />
          </button>
          {['home', 'shop', 'wishlist', 'orders'].map(p => (
            <button key={p} className="nav-link" style={{ textAlign: 'left', width: '100%', fontSize: 18, padding: '14px 16px' }}
              onClick={() => { setPage(p); setMenuOpen(false); }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setAuthModal('login'); setMenuOpen(false); }}>Login</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setAuthModal('signup'); setMenuOpen(false); }}>Sign Up</button>
          </div>
        </div>
      )}
    </>
  );
}
