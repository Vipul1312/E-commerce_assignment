import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { user, updateUserProfile, orders, notify } = useApp();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', dob: user?.dob || '', address: user?.address || '' });
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  const handleSave = async () => {
    if (!form.name || !form.email) return notify('Name and email are required', 'error');
    try {
      await updateUserProfile(form);
      setSaved(true);
      notify('Profile updated successfully! ✓');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      notify(err.message || 'Profile update failed', 'error');
    }
  };

  return (
    <div className="section" style={{ paddingTop: 120 }}>
      <div className="section-header">
        <div className="section-eyebrow">Account</div>
        <h1 className="section-title">My Profile</h1>
      </div>
      <div className="profile-grid">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            <span style={{ fontSize: 40 }}>{form.name.charAt(0).toUpperCase() || '👤'}</span>
          </div>
          <div className="profile-name">{form.name || user.name}</div>
          <div className="profile-email">{form.email || user.email}</div>
          {form.phone && <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 4 }}>{form.phone}</div>}
          <div className="profile-badge" style={{ marginTop: 12 }}>{user.role === 'admin' ? 'Administrator' : 'Premium Member'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
            {[['Orders', orders.length], ['Spent', `$${totalSpent.toLocaleString()}`]].map(([l, v]) => (
              <div key={l} style={{ background: 'var(--bone)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: 24, fontWeight: 700 }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div>
          <div className="checkout-card" style={{ borderRadius: 20 }}>
            <div className="checkout-section-title">Personal Information</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Email Address *</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 00000 00000" /></div>
              <div className="form-group"><label className="form-label">Date of Birth</label><input className="form-input" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>
            </div>
            <div className="form-group"><label className="form-label">Default Shipping Address</label><input className="form-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main St, City, State, PIN" /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={handleSave} style={{ background: saved ? '#10b981' : undefined }}>
                {saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
