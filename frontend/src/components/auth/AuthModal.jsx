import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const PASSWORD_RULES = [
  { label: 'At least 8 characters',       test: p => p.length >= 8 },
  { label: 'Uppercase letter (A-Z)',        test: p => /[A-Z]/.test(p) },
  { label: 'Lowercase letter (a-z)',        test: p => /[a-z]/.test(p) },
  { label: 'Number (0-9)',                  test: p => /[0-9]/.test(p) },
  { label: 'Special character (!@#$...)',   test: p => /[^A-Za-z0-9]/.test(p) },
];

export default function AuthModal() {
  const { authModal, setAuthModal, loginUser, registerUser, notify, setPage } = useApp();
  const [mode, setMode] = useState(authModal);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fpEmail, setFpEmail] = useState('');
  const [fpSent, setFpSent] = useState(false);

  useEffect(() => setMode(authModal), [authModal]);
  if (!authModal) return null;

  const passwordStrength = PASSWORD_RULES.filter(r => r.test(form.password)).length;

  const handleSubmit = async () => {
    if (mode === 'login') {
      if (!form.email || !form.password) return notify('Please fill in all fields', 'error');
      try {
        const u = await loginUser(form.email, form.password);
        notify(`Welcome back, ${u.name}! ✨`);
        setAuthModal(null);
        if (u.role === 'admin') setPage('admin');
      } catch (err) {
        notify(err.message || 'Login failed', 'error');
      }
    } else {
      if (!form.name || !form.email || !form.password) return notify('Please fill in all fields', 'error');
      if (passwordStrength < 5) return notify('Password does not meet all requirements', 'error');
      try {
        const u = await registerUser(form.name, form.email, form.password);
        notify(`Welcome to LUXE, ${u.name}! ✨`);
        setAuthModal(null);
      } catch (err) {
        if (err.message?.includes('registered')) {
          notify('Account already exists! Please login.', 'error');
          setTimeout(() => setMode('login'), 1200);
        } else {
          notify(err.message || 'Signup failed', 'error');
        }
      }
    }
  };

  const handleForgotPassword = () => {
    if (!fpEmail) return notify('Please enter your email address', 'error');
    setFpSent(true);
    notify(`Password reset link sent to ${fpEmail} ✓`);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setAuthModal(null)}>
      <div className="modal" style={{ position: 'relative' }}>
        <button className="modal-close" onClick={() => setAuthModal(null)}>✕</button>
        <div className="auth-modal">

          {mode === 'forgot' && (
            <>
              <div style={{ fontSize: 40, marginBottom: 12, textAlign: 'center' }}>🔑</div>
              <div className="auth-title font-display" style={{ textAlign: 'center' }}>Forgot Password?</div>
              <div className="auth-sub" style={{ textAlign: 'center' }}>Enter your email and we'll send you a reset link</div>
              {!fpSent ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" placeholder="you@email.com" value={fpEmail} onChange={e => setFpEmail(e.target.value)} />
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={handleForgotPassword}>Send Reset Link →</button>
                </>
              ) : (
                <div style={{ textAlign: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '24px 20px', marginTop: 8 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: '#16a34a' }}>Email Sent!</div>
                  <div style={{ fontSize: 14, color: 'var(--ink-muted)' }}>Check your inbox at <strong>{fpEmail}</strong></div>
                </div>
              )}
              <div className="auth-switch" style={{ marginTop: 20 }}>
                <button onClick={() => { setMode('login'); setFpSent(false); setFpEmail(''); }}>← Back to Sign In</button>
              </div>
            </>
          )}

          {mode === 'login' && (
            <>
              <div className="auth-title font-display">Welcome back</div>
              <div className="auth-sub">Sign in to your LUXE account</div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <div style={{ textAlign: 'right', marginTop: 6 }}>
                  <button onClick={() => setMode('forgot')} style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--gold)', cursor: 'pointer', fontWeight: 600 }}>
                    Forgot Password?
                  </button>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={handleSubmit}>Sign In →</button>
              <div className="auth-switch">
                Don't have an account? <button onClick={() => setMode('signup')}>Sign up</button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <>
              <div className="auth-title font-display">Create account</div>
              <div className="auth-sub">Join the LUXE community today</div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Alex Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                {form.password.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, transition: 'all 0.3s', background: i <= passwordStrength ? (passwordStrength <= 2 ? '#ef4444' : passwordStrength <= 3 ? '#f97316' : passwordStrength <= 4 ? '#eab308' : '#10b981') : 'var(--border-strong)' }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: passwordStrength <= 2 ? '#ef4444' : passwordStrength === 3 ? '#f97316' : passwordStrength === 4 ? '#eab308' : '#10b981' }}>
                      {passwordStrength <= 2 ? 'Weak' : passwordStrength === 3 ? 'Fair' : passwordStrength === 4 ? 'Good' : 'Strong ✓'}
                    </div>
                    {PASSWORD_RULES.map(rule => (
                      <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                        <span style={{ color: rule.test(form.password) ? '#10b981' : 'var(--ink-muted)' }}>{rule.test(form.password) ? '✓' : '○'}</span>
                        <span style={{ color: rule.test(form.password) ? '#10b981' : 'var(--ink-muted)' }}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 8, opacity: passwordStrength < 5 && form.password.length > 0 ? 0.6 : 1 }} onClick={handleSubmit}>
                Create Account →
              </button>
              <div className="auth-switch">
                Already have an account? <button onClick={() => setMode('login')}>Sign in</button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
