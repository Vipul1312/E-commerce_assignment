import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function CheckoutPage() {
  const { cart, setCart, cartTotal, checkoutStep, setCheckoutStep, setOrders, user, setAuthModal, setPage, notify } = useApp();
  const [payMethod, setPayMethod] = useState('card');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', address: '', city: '', state: '', zip: '', country: 'US' });
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [successOrder, setSuccessOrder] = useState(null);

  if (successOrder) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, padding: '48px 32px', background: 'var(--white)', borderRadius: 28, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)', margin: '24px' }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 40, boxShadow: '0 12px 40px rgba(16,185,129,0.3)' }}>✓</div>
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 42, fontWeight: 500, color: 'var(--ink)', marginBottom: 12, letterSpacing: -1 }}>Order Placed!</div>
          <div style={{ fontSize: 16, color: 'var(--ink-muted)', marginBottom: 8 }}>Thank you, <strong>{user.name}</strong>! Your order has been confirmed.</div>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 32 }}>A confirmation email has been sent to <strong>{user.email}</strong></div>
          <div style={{ background: 'var(--bone)', borderRadius: 14, padding: '16px 24px', marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--gold)', marginBottom: 6 }}>Order ID</div>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: 22, fontWeight: 700 }}>{successOrder._id}</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => { setPage('home'); setSuccessOrder(null); }}>Back to Home</button>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setPage('orders'); setSuccessOrder(null); }}>View Orders</button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return (
    <div className="section" style={{ paddingTop: 120, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: 36, fontWeight: 500, marginBottom: 12 }}>Sign in to Checkout</div>
      <button className="btn btn-primary btn-lg" onClick={() => setAuthModal('login')}>Sign In</button>
    </div>
  );

  if (cart.length === 0) return (
    <div className="section" style={{ paddingTop: 120, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: 36, marginBottom: 24 }}>Your cart is empty</div>
      <button className="btn btn-primary btn-lg" onClick={() => setPage('shop')}>Start Shopping</button>
    </div>
  );

  const steps    = ['Shipping', 'Payment', 'Review'];
  const shipping = 15;
  const tax      = Math.round(cartTotal * 0.1);
  const total    = cartTotal + shipping + tax;

  const placeOrder = async () => {
    try {
      const orderData = {
        items: cart.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, qty: i.qty })),
        shippingAddress: form,
        paymentMethod: payMethod,
        subtotal: cartTotal,
        shipping,
        tax,
        total,
      };
      const data = await api.createOrder(orderData);
      setOrders(prev => [data.order, ...prev]);
      setSuccessOrder(data.order);
      setCart([]);
      setCheckoutStep(1);
    } catch (err) {
      notify(err.message || 'Order could not be placed', 'error');
    }
  };

  const OrderSummary = () => (
    <div className="order-summary">
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Order Summary</div>
      <div className="order-items-list">
        {cart.map(item => (
          <div key={item._id} className="order-item">
            <span>{item.image} {item.name} × {item.qty}</span>
            <span>${(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="order-totals">
        <div className="order-total-row"><span>Subtotal</span><span>${cartTotal.toLocaleString()}</span></div>
        <div className="order-total-row"><span>Shipping</span><span>${shipping}</span></div>
        <div className="order-total-row"><span>Tax (10%)</span><span>${tax}</span></div>
        <div className="order-total-row" style={{ marginTop: 12, paddingTop: 12, borderTop: '2px solid var(--border-strong)' }}>
          <span style={{ fontWeight: 700 }}>Total</span>
          <span className="order-total-final">${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="section" style={{ paddingTop: 120 }}>
      <div className="section-header">
        <div className="section-eyebrow">Checkout</div>
        <h1 className="section-title">Complete Your Order</h1>
      </div>

      <div className="checkout-steps">
        {steps.map((s, i) => (
          <div key={s} className="checkout-step-item">
            <div className={`checkout-step-dot ${checkoutStep > i + 1 ? 'done' : checkoutStep === i + 1 ? 'active' : ''}`}>
              {checkoutStep > i + 1 ? '✓' : i + 1}
            </div>
            <div className={`checkout-step-label ${checkoutStep === i + 1 ? 'active' : ''}`}>{s}</div>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div>
          {/* Step 1: Shipping */}
          {checkoutStep === 1 && (
            <div className="checkout-card">
              <div className="checkout-section-title">Shipping Information</div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Alex Johnson" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" /></div>
              </div>
              <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" /></div>
              <div className="form-group"><label className="form-label">Street Address</label><input className="form-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main Street, Apt 4B" /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="New York" /></div>
                <div className="form-group"><label className="form-label">State</label><input className="form-input" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="NY" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">ZIP Code</label><input className="form-input" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} placeholder="10001" /></div>
                <div className="form-group"><label className="form-label">Country</label>
                  <select className="form-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                    <option>US</option><option>UK</option><option>CA</option><option>AU</option><option>IN</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} onClick={() => setCheckoutStep(2)}>Continue to Payment →</button>
            </div>
          )}

          {/* Step 2: Payment */}
          {checkoutStep === 2 && (
            <div className="checkout-card">
              <div className="checkout-section-title">Payment Method</div>
              <div className="payment-methods">
                {[['card', '💳', 'Credit Card'], ['paypal', '🅿', 'PayPal'], ['stripe', '⚡', 'Stripe']].map(([v, icon, label]) => (
                  <div key={v} className={`payment-method ${payMethod === v ? 'active' : ''}`} onClick={() => setPayMethod(v)}>
                    <div className="payment-method-icon">{icon}</div>
                    <div className="payment-method-name">{label}</div>
                  </div>
                ))}
              </div>
              {payMethod === 'card' && (
                <>
                  <div className="form-group"><label className="form-label">Card Holder Name</label><input className="form-input" value={cardForm.holder} onChange={e => setCardForm({ ...cardForm, holder: e.target.value })} placeholder="Alex Johnson" /></div>
                  <div className="form-group"><label className="form-label">Card Number</label><input className="form-input" value={cardForm.number} onChange={e => setCardForm({ ...cardForm, number: e.target.value })} placeholder="4242 4242 4242 4242" maxLength={19} /></div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Expiry</label><input className="form-input" value={cardForm.expiry} onChange={e => setCardForm({ ...cardForm, expiry: e.target.value })} placeholder="MM/YY" maxLength={5} /></div>
                    <div className="form-group"><label className="form-label">CVV</label><input className="form-input" value={cardForm.cvv} onChange={e => setCardForm({ ...cardForm, cvv: e.target.value })} placeholder="123" maxLength={4} /></div>
                  </div>
                  <div style={{ background: 'var(--bone)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--ink-muted)' }}>🔒 Your payment information is encrypted and secure</div>
                </>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => setCheckoutStep(1)}>← Back</button>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => setCheckoutStep(3)}>Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {checkoutStep === 3 && (
            <div className="checkout-card">
              <div className="checkout-section-title">Review Your Order</div>
              <div style={{ background: 'var(--bone)', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--ink-muted)', marginBottom: 12 }}>Shipping to</div>
                <div style={{ fontWeight: 600 }}>{form.name}</div>
                <div style={{ fontSize: 14, color: 'var(--ink-muted)', marginTop: 4 }}>{form.address}, {form.city}, {form.state} {form.zip}</div>
                <div style={{ fontSize: 14, color: 'var(--ink-muted)' }}>{form.email} · {form.phone}</div>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#16a34a' }}>
                ✓ By placing this order you agree to our Terms of Service and Privacy Policy
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setCheckoutStep(2)}>← Back</button>
                <button className="btn btn-gold btn-lg" style={{ flex: 1 }} onClick={placeOrder}>Place Order — ${total.toLocaleString()}</button>
              </div>
            </div>
          )}
        </div>

        <OrderSummary />
      </div>
    </div>
  );
}
