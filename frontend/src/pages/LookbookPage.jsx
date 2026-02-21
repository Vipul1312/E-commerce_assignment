import { useApp } from '../context/AppContext';

export default function LookbookPage() {
  const { setPage, setSelectedProduct, products } = useApp();
  const picks = products.filter(p => p.featured);
  const edits = [
    { title: 'The Minimalist', desc: 'Clean lines, timeless silhouettes, zero excess.',    emoji: '🖤', products: products.slice(0, 3),  bg: '#0a0a0a',  color: '#fff' },
    { title: 'The Wanderer',   desc: 'Built for travel. Designed to last a lifetime.',      emoji: '✈️', products: products.slice(3, 6),  bg: '#f7f4ef',  color: '#0a0a0a' },
    { title: 'The Connoisseur',desc: 'Only the finest. Only the best.',                    emoji: '✦',  products: products.slice(6, 9),  bg: '#c9a84c',  color: '#fff' },
  ];

  return (
    <div style={{ paddingTop: 72 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0a0a0a,#1a1208)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>✦ The LUXE Lookbook 2025 ✦</div>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(52px,8vw,110px)', fontWeight: 300, color: '#fff', lineHeight: 1, letterSpacing: -3, marginBottom: 24 }}>Art of<br /><em style={{ color: 'var(--gold-light)' }}>Living Well</em></h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.8 }}>A curated editorial showcasing how our pieces become part of your daily narrative.</p>
          <button className="btn btn-gold btn-lg" onClick={() => setPage('shop')}>Shop the Edit →</button>
        </div>
      </div>

      {/* Editorial Sections */}
      {edits.map((edit, ei) => (
        <div key={edit.title} style={{ background: edit.bg, padding: '80px 24px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: ei === 2 ? 'rgba(255,255,255,0.6)' : 'var(--gold)', marginBottom: 10 }}>Chapter {String(ei + 1).padStart(2, '0')}</div>
                <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(40px,5vw,72px)', fontWeight: 300, color: edit.color, letterSpacing: -2, lineHeight: 1 }}>{edit.title}</h2>
                <p style={{ fontSize: 15, color: ei === 2 ? 'rgba(255,255,255,0.7)' : 'var(--ink-muted)', marginTop: 12, maxWidth: 340 }}>{edit.desc}</p>
              </div>
              <span style={{ fontSize: 64 }}>{edit.emoji}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {edit.products.map(p => (
                <div key={p._id} onClick={() => setSelectedProduct(p)}
                  style={{ background: ei === 0 ? 'rgba(255,255,255,0.05)' : ei === 2 ? 'rgba(255,255,255,0.15)' : '#fff', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'var(--transition)', border: `1px solid ${ei === 0 ? 'rgba(255,255,255,0.08)' : ei === 2 ? 'rgba(255,255,255,0.2)' : 'var(--border)'}` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>{p.image}</div>
                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--gold)', marginBottom: 6 }}>{p.category}</div>
                    <div style={{ fontFamily: 'var(--ff-display)', fontSize: 22, fontWeight: 500, color: edit.color, marginBottom: 8 }}>{p.name}</div>
                    <div style={{ fontFamily: 'var(--ff-display)', fontSize: 20, color: ei === 2 ? 'rgba(255,255,255,0.9)' : 'var(--ink)' }}>${p.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Editor's Picks */}
      <div style={{ background: 'var(--cream)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Editor's Picks</div>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(36px,4vw,56px)', fontWeight: 300, letterSpacing: -1, marginBottom: 48 }}>The Definitive Selection</h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {picks.map(p => (
              <div key={p._id} onClick={() => setSelectedProduct(p)}
                style={{ background: 'var(--white)', borderRadius: 16, padding: '24px 32px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'var(--transition)', minWidth: 220 }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <span style={{ fontSize: 40 }}>{p.image}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--ff-display)', fontSize: 18, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 600 }}>${p.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-lg" style={{ marginTop: 56 }} onClick={() => setPage('shop')}>Shop Full Collection →</button>
        </div>
      </div>
    </div>
  );
}
