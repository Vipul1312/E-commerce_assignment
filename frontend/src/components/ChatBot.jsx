import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const BOT_RESPONSES = {
  greet: {
    patterns: ['hi', 'hello', 'hey', 'hii', 'helo', 'namaste'],
    response: () => `👋 Hi there! Welcome to **LUXE**! I'm your shopping assistant.\n\nHow can I help you today? You can ask me about:\n- 🛍️ Products & recommendations\n- 📦 Your orders\n- 🚚 Shipping info\n- 💳 Payment methods\n- ↩️ Return policy`,
  },
  products: {
    patterns: ['product', 'show', 'collection', 'what do you sell', 'items', 'catalog', 'browse'],
    response: () => `✨ We have an amazing collection!\n\n**Categories:**\n- ⌚ Watches\n- 👟 Footwear\n- 👜 Accessories\n- 🕶️ Eyewear\n- 👕 Clothing\n- 🎧 Electronics\n- 🧳 Bags\n- ☕ Kitchen\n- 💡 Home\n\nVisit our **Shop** page to browse all products with filters!`,
  },
  shipping: {
    patterns: ['shipping', 'delivery', 'ship', 'deliver', 'how long', 'days'],
    response: () => `🚚 **Shipping Info:**\n\n- Free shipping on orders over **$100**\n- Standard delivery: **5-7 business days**\n- Express delivery: **2-3 business days**\n- International shipping available\n\nAll orders are tracked with real-time updates! 📍`,
  },
  return: {
    patterns: ['return', 'refund', 'exchange', 'cancel', 'money back'],
    response: () => `↩️ **Return Policy:**\n\n- **30-day** hassle-free returns\n- Items must be unused & in original packaging\n- Refund processed within **5-7 business days**\n- Free return shipping on defective items\n\nTo initiate a return, go to **My Orders** and click "Return Item".`,
  },
  payment: {
    patterns: ['payment', 'pay', 'card', 'cash', 'upi', 'methods', 'how to pay'],
    response: () => `💳 **Payment Methods:**\n\n- Credit/Debit Cards (Visa, Mastercard)\n- PayPal\n- Stripe\n- UPI (coming soon)\n- Cash on Delivery (select areas)\n\nAll payments are **256-bit SSL encrypted** 🔒`,
  },
  discount: {
    patterns: ['discount', 'coupon', 'offer', 'promo', 'sale', 'code', 'deal'],
    response: () => `🎉 **Current Offers:**\n\n- **LUXE10** → 10% off on first order\n- **SALE40** → Up to 40% off on sale items\n- Free shipping on orders above **$100**\n\nCheck our **Shop** page for sale items! 🛍️`,
  },
  order: {
    patterns: ['order', 'track', 'status', 'my order', 'where is', 'placed'],
    response: (user) => user
      ? `📦 **Your Orders:**\n\nGo to **My Orders** page to:\n- Track your current orders\n- View order history\n- Download invoices\n- Initiate returns\n\nYou're logged in as **${user.name}** ✅`
      : `📦 **Order Tracking:**\n\nPlease **login** first to view your orders!\n\nClick the **Login** button in the navbar to sign in.`,
  },
  account: {
    patterns: ['account', 'login', 'signup', 'register', 'profile', 'sign in', 'sign up'],
    response: (user) => user
      ? `👤 You're already logged in as **${user.name}**!\n\nYou can:\n- View your **Profile**\n- Check your **Orders**\n- Update your details\n\nClick your name in the navbar to access your account.`
      : `👤 **Create your LUXE account:**\n\n- Click **Sign Up** in the navbar\n- Fill in your details\n- Start shopping instantly!\n\nAlready have an account? Click **Login**!`,
  },
  recommend: {
    patterns: ['recommend', 'suggest', 'best', 'popular', 'trending', 'top', 'good', 'bestseller'],
    response: () => `⭐ **Our Best Sellers:**\n\n1. ⌚ Arc Titanium Chronograph — $1,299\n2. 🎧 Phantom Wireless Earbuds — $349\n3. 👟 Obsidian Leather Sneakers — $289\n4. 🧥 Ultralight Packable Jacket — $249\n5. 💡 Minimalist Desk Lamp — $219\n\nAll rated **4.7+ stars** by our customers! ⭐`,
  },
  contact: {
    patterns: ['contact', 'support', 'help', 'email', 'call', 'customer service', 'complaint'],
    response: () => `📞 **Contact Us:**\n\n- 📧 Email: support@luxe.com\n- ⏰ Support hours: Mon-Sat, 9AM-6PM\n- 💬 Live chat: Available here!\n\nFor urgent issues, email us directly and we'll respond within **24 hours**.`,
  },
  price: {
    patterns: ['price', 'cost', 'expensive', 'cheap', 'affordable', 'how much'],
    response: () => `💰 **Price Range:**\n\n- Budget picks: **$79 - $149**\n- Mid range: **$150 - $299**\n- Premium: **$300+**\n\nUse our **price filter** on the Shop page to find items in your budget! 🎯`,
  },
  bye: {
    patterns: ['bye', 'goodbye', 'thanks', 'thank you', 'ok bye', 'cya', 'see you'],
    response: () => `😊 Thank you for visiting **LUXE**!\n\nHappy shopping! If you need anything else, I'm always here. 👋\n\n✨ Don't forget to check our **sale items**!`,
  },
};

const QUICK_QUESTIONS = [
  '👋 Say Hello',
  '🛍️ Browse Products',
  '🚚 Shipping Info',
  '💳 Payment Methods',
  '↩️ Return Policy',
  '⭐ Best Sellers',
  '🎁 Discounts & Offers',
  '📦 Track My Order',
];

function getBotResponse(input, user) {
  const lower = input.toLowerCase().trim();
  for (const key of Object.keys(BOT_RESPONSES)) {
    const { patterns, response } = BOT_RESPONSES[key];
    if (patterns.some(p => lower.includes(p))) {
      return response(user);
    }
  }
  return `🤔 I'm not sure about that!\n\nYou can ask me about:\n- Products & recommendations\n- Shipping & delivery\n- Returns & refunds\n- Payment methods\n- Your orders\n\nOr contact us at **support@luxe.com** 📧`;
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function ChatBot() {
  const { user } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: `👋 Hi${user ? ` **${user.name}**` : ''}! Welcome to **LUXE**!\n\nI'm your AI shopping assistant. How can I help you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [open, messages]);

  const sendMessage = (text) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    const userMsg = {
      id: Date.now(),
      from: 'user',
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        from: 'bot',
        text: getBotResponse(msgText, user),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botReply]);
      setTyping(false);
      if (!open) setUnread(prev => prev + 1);
    }, 800 + Math.random() * 500);
  };

  return (
    <>
      {/* Chat Button */}
      <div style={{
        position: 'fixed',
        bottom: 28, right: 28,
        zIndex: 9000,
      }}>
        {!open && (
          <div style={{
            position: 'absolute',
            bottom: '110%', right: 0,
            background: 'var(--ink)',
            color: 'var(--white)',
            padding: '10px 16px',
            borderRadius: '12px 12px 0 12px',
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
            animation: 'fadeInUp 0.4s ease',
            fontFamily: 'var(--ff-body)',
          }}>
            💬 Need help? Chat with us!
            <div style={{
              position: 'absolute',
              bottom: -6, right: 16,
              width: 12, height: 12,
              background: 'var(--ink)',
              transform: 'rotate(45deg)',
              borderRight: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }}/>
          </div>
        )}

        <button onClick={() => setOpen(!open)} style={{
          width: 60, height: 60,
          borderRadius: '50%',
          background: open ? 'var(--ink-soft)' : 'linear-gradient(135deg, var(--gold), var(--gold-light))',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          boxShadow: '0 8px 32px rgba(201,168,76,0.4)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: open ? 'rotate(360deg)' : 'rotate(0)',
          position: 'relative',
        }}>
          {open ? '✕' : '💬'}
          {!open && unread > 0 && (
            <div style={{
              position: 'absolute',
              top: -4, right: -4,
              width: 20, height: 20,
              background: '#ef4444',
              borderRadius: '50%',
              fontSize: 11,
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--ff-body)',
            }}>{unread}</div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 104, right: 28,
          width: 380, height: 560,
          background: 'var(--white)',
          borderRadius: 24,
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 8999,
          animation: 'slideInChat 0.3s cubic-bezier(0.4,0,0.2,1)',
          fontFamily: 'var(--ff-body)',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--ink), #1a1208)',
            padding: '20px 20px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}>✦</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'var(--ff-display)' }}>LUXE Assistant</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, background: '#3ddc84', borderRadius: '50%' }}/>
                Online · Typically replies instantly
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              width: 32, height: 32,
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: '#f8f6f2',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: msg.from === 'user' ? 'row-reverse' : 'row',
                gap: 8,
                alignItems: 'flex-end',
              }}>
                {msg.from === 'bot' && (
                  <div style={{
                    width: 28, height: 28,
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    flexShrink: 0,
                  }}>✦</div>
                )}
                <div style={{ maxWidth: '78%' }}>
                  <div style={{
                    background: msg.from === 'user' ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : '#fff',
                    color: msg.from === 'user' ? 'var(--ink)' : 'var(--ink)',
                    padding: '12px 16px',
                    borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: 13,
                    lineHeight: 1.6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    fontWeight: 400,
                  }} dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                  <div style={{
                    fontSize: 10,
                    color: 'var(--ink-muted)',
                    marginTop: 4,
                    textAlign: msg.from === 'user' ? 'right' : 'left',
                  }}>{msg.time}</div>
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✦</div>
                <div style={{ background: '#fff', padding: '14px 18px', borderRadius: '18px 18px 18px 4px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7,
                      background: 'var(--ink-muted)',
                      borderRadius: '50%',
                      animation: `typingDot 1.2s ${i * 0.2}s infinite`,
                    }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div style={{
            padding: '10px 12px 6px',
            background: '#fff',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}>
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => sendMessage(q)} style={{
                background: 'var(--bone)',
                border: '1px solid var(--border)',
                borderRadius: 100,
                padding: '5px 12px',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--ink)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontFamily: 'var(--ff-body)',
              }}
              onMouseEnter={e => { e.target.style.background = 'var(--gold-pale)'; e.target.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={e => { e.target.style.background = 'var(--bone)'; e.target.style.borderColor = 'var(--border)'; }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            background: '#fff',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                background: 'var(--bone)',
                border: '1px solid var(--border)',
                borderRadius: 100,
                padding: '10px 16px',
                fontSize: 13,
                color: 'var(--ink)',
                outline: 'none',
                fontFamily: 'var(--ff-body)',
              }}
            />
            <button onClick={() => sendMessage()} style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              ➤
            </button>
          </div>

        </div>
      )}

      <style>{`
        @keyframes slideInChat {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
