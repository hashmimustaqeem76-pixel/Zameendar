import { useMemo, useState } from 'react';

const DEMO_DATA = {
  user: {
    name: 'Demo User',
    role: 'Retailer',
    district: 'Lahore'
  },
  crops: [
    { id: 'c1', name: 'Farm Tomatoes', emoji: '🍅', pricePerKg: 45, availableQtyKg: 500, badge: 'Fresh' },
    { id: 'c2', name: 'Premium Onion', emoji: '🧅', pricePerKg: 38, availableQtyKg: 1200, badge: 'Organic' },
    { id: 'c3', name: 'White Potato', emoji: '🥔', pricePerKg: 28, availableQtyKg: 2000, badge: 'Fresh' },
    { id: 'c4', name: 'Sindhri Mango', emoji: '🥭', pricePerKg: 120, availableQtyKg: 800, badge: 'Seasonal' },
    { id: 'c5', name: 'Basmati Rice', emoji: '🍚', pricePerKg: 120, availableQtyKg: 4000, badge: 'Premium' },
    { id: 'c6', name: 'Kala Kulu Apple', emoji: '🍎', pricePerKg: 180, availableQtyKg: 300, badge: 'Fresh' },
    { id: 'c7', name: 'Mustard Greens', emoji: '🥬', pricePerKg: 36, availableQtyKg: 720, badge: 'Organic' },
    { id: 'c8', name: 'Roasted Chickpeas', emoji: '🌰', pricePerKg: 95, availableQtyKg: 260, badge: 'New' }
  ],
  prices: [
    { id: 'p1', cropName: 'Tomato', pricePerKg: 45, change: '+2.3%' },
    { id: 'p2', cropName: 'Onion', pricePerKg: 38, change: '-1.1%' },
    { id: 'p3', cropName: 'Potato', pricePerKg: 28, change: '+0.5%' },
    { id: 'p4', cropName: 'Mango', pricePerKg: 120, change: '+4.2%' }
  ],
  centers: [
    { id: 'cc1', name: 'Sahiwal Central Hub', district: 'Sahiwal', status: 'Open' },
    { id: 'cc2', name: 'Okara Agri Point', district: 'Okara', status: 'Closing soon' },
    { id: 'cc3', name: 'Faisalabad Grain Center', district: 'Faisalabad', status: 'Open 24h' }
  ],
  dashboard: {
    totalOrders: 12,
    pendingOrders: 3,
    deliveredOrders: 6,
    totalSpend: 11200
  },
  orders: [
    {
      id: 'o1',
      createdAt: '2025-05-05',
      status: 'Delivered',
      total: 2250,
      items: [
        { name: 'Tomatoes', qty: 50, pricePerKg: 45 }
      ]
    },
    {
      id: 'o2',
      createdAt: '2025-05-04',
      status: 'Pending',
      total: 3800,
      items: [
        { name: 'Onions', qty: 100, pricePerKg: 38 }
      ]
    }
  ]
};

const pages = [
  { id: 'home', label: 'Home' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'prices', label: 'Prices' },
  { id: 'centers', label: 'Centers' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Orders' }
];

function App() {
  const [phone, setPhone] = useState('+923001234567');
  const [password, setPassword] = useState('demo');
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState(DEMO_DATA.orders);
  const [message, setMessage] = useState('Use the login form to enter the site.');

  const login = (event) => {
    event.preventDefault();
    const demoUser = {
      name: 'Demo User',
      role: phone.includes('+92333') ? 'Retailer' : 'Farmer',
      district: 'Lahore'
    };
    setUser(demoUser);
    setLoggedIn(true);
    setPage('home');
    setMessage('Logged in successfully. Start exploring the marketplace.');
  };

  const logout = () => {
    setLoggedIn(false);
    setPage('home');
    setUser(null);
    setPhone('+923001234567');
    setPassword('demo');
    setCart([]);
    setMessage('You have been logged out.');
  };

  const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.pricePerKg * item.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.qty, 0), [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
    setMessage(`${product.name} added to cart.`);
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) => prevCart
      .map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
      .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    setMessage('Item removed from cart.');
  };

  const checkout = () => {
    if (!cart.length) {
      setMessage('Your cart is empty. Add a product first.');
      return;
    }

    const newOrder = {
      id: `o${orderHistory.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      total: cartTotal,
      items: cart.map((item) => ({ name: item.name, qty: item.qty, pricePerKg: item.pricePerKg }))
    };

    setOrderHistory([newOrder, ...orderHistory]);
    setCart([]);
    setPage('orders');
    setMessage('Checkout complete! Your demo order has been placed.');
  };

  const renderPageContent = () => {
    if (page === 'home') {
      return (
        <div className="content-block">
          <h3>Welcome to your demo store</h3>
          <p>This is a classroom-ready presentation of ZameenDar. Use the navigation buttons to explore the marketplace, view live prices, check nearby centers, and see your dashboard.</p>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Orders this week</span>
              <strong>{DEMO_DATA.dashboard.totalOrders}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Delivered</span>
              <strong>{DEMO_DATA.dashboard.deliveredOrders}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pending</span>
              <strong>{DEMO_DATA.dashboard.pendingOrders}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Spend</span>
              <strong>PKR {DEMO_DATA.dashboard.totalSpend}</strong>
            </div>
          </div>
        </div>
      );
    }

    if (page === 'marketplace') {
      return (
        <div className="market-grid">
          <div className="card-grid">
            {DEMO_DATA.crops.map((product) => (
              <article key={product.id} className="card">
                <div className="card-emoji">{product.emoji}</div>
                <h3>{product.name}</h3>
                <p>{product.badge} · {product.availableQtyKg} kg available</p>
                <div className="card-footer">
                  <span>PKR {product.pricePerKg}/kg</span>
                  <button onClick={() => addToCart(product)}>Add to cart</button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-panel">
            <h3>Cart</h3>
            {cart.length ? (
              <>
                <div className="cart-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <strong>{item.name}</strong>
                        <div>PKR {item.pricePerKg}/kg · Qty: {item.qty}</div>
                      </div>
                      <div className="cart-actions">
                        <button onClick={() => updateQty(item.id, -1)}>-</button>
                        <button onClick={() => updateQty(item.id, 1)}>+</button>
                        <button onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><strong>{cartCount} item(s)</strong></div>
                  <div><strong>Total: PKR {cartTotal}</strong></div>
                </div>
                <button className="checkout-btn" onClick={checkout}>Checkout</button>
              </>
            ) : (
              <p>Your cart is empty. Add products to continue.</p>
            )}
          </aside>
        </div>
      );
    }

    if (page === 'prices') {
      return (
        <div className="card-grid small">
          {DEMO_DATA.prices.map((item) => (
            <article key={item.id} className="small-card">
              <h3>{item.cropName}</h3>
              <p>PKR {item.pricePerKg}/kg</p>
              <span>{item.change}</span>
            </article>
          ))}
        </div>
      );
    }

    if (page === 'centers') {
      return (
        <div className="card-grid small">
          {DEMO_DATA.centers.map((center) => (
            <article key={center.id} className="small-card">
              <h3>{center.name}</h3>
              <p>{center.district}</p>
              <span>{center.status}</span>
            </article>
          ))}
        </div>
      );
    }

    if (page === 'dashboard') {
      return (
        <div className="content-block">
          <h3>Dashboard Snapshot</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Orders</span>
              <strong>{DEMO_DATA.dashboard.totalOrders}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pending</span>
              <strong>{DEMO_DATA.dashboard.pendingOrders}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Delivered</span>
              <strong>{DEMO_DATA.dashboard.deliveredOrders}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Spend</span>
              <strong>PKR {DEMO_DATA.dashboard.totalSpend}</strong>
            </div>
          </div>
        </div>
      );
    }

    if (page === 'orders') {
      return (
        <div className="content-block">
          <h3>Order History</h3>
          <div className="order-table">
            <div className="order-row header">
              <span>Order</span>
              <span>Date</span>
              <span>Status</span>
              <span>Total</span>
            </div>
            {orderHistory.map((order) => (
              <div key={order.id} className="order-row">
                <span>{order.id}</span>
                <span>{order.createdAt}</span>
                <span>{order.status}</span>
                <span>PKR {order.total}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-shell">
      <header>
        <div>
          <h1>ZameenDar Demo</h1>
          <p>A classroom-ready dummy marketplace experience.</p>
        </div>
        <div className="status">
          <strong>Status:</strong> {loggedIn ? 'Exploring the site' : 'Login screen'}
        </div>
      </header>

      <main>
        {!loggedIn ? (
          <section className="panel login-panel">
            <h2>Dummy Login</h2>
            <p>Enter any phone and password to proceed. This is a presentation demo.</p>
            <form onSubmit={login}>
              <label>
                Phone
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
              <button type="submit">Enter the site</button>
            </form>
          </section>
        ) : (
          <>
            <section className="panel nav-panel">
              <div>
                <h2>Welcome back, {user?.name}</h2>
                <p>Explore the demo pages to view marketplace, prices, collection centers, and your dashboard.</p>
                <div className="message-banner">{message}</div>
              </div>
              <div className="page-buttons">
                {pages.map((item) => (
                  <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)}>
                    {item.label}
                  </button>
                ))}
                <button className="logout" onClick={logout}>Logout</button>
              </div>
            </section>
            <section className="panel content-panel">
              {renderPageContent()}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
