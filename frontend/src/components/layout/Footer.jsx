import { useApp } from '../../context/AppContext';

export default function Footer() {
  const { setPage } = useApp();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand-name">LUXE ✦</div>
          <div className="footer-brand-desc">Curating the finest products for those who appreciate quality, craftsmanship, and enduring design.</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {['𝕏', 'in', '📘', '📸'].map(s => (
              <div key={s} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>
                {s}
              </div>
            ))}
          </div>
        </div>
        {[['Shop', ['New Arrivals', 'Best Sellers', 'Sale', 'All Products']], ['Help', ['Shipping', 'Returns', 'Size Guide', 'Contact']], ['Company', ['About', 'Press', 'Careers', 'Privacy']]].map(([title, links]) => (
          <div key={title}>
            <div className="footer-col-title">{title}</div>
            {links.map(l => <a key={l} className="footer-col-link" onClick={() => setPage('shop')}>{l}</a>)}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <div>© 2025 LUXE. All rights reserved. Built with precision.</div>
      </div>
    </footer>
  );
}
