import { FormEvent, useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Box,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Users,
  X,
  Edit2,
  Eye,
  EyeOff,
  CheckCircle2,
  Printer,
  Trash2,
  AlertTriangle,
  Search,
  MessageSquare,
  Shield,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Clock,
  Sparkles,
  TrendingUp,
  FileText,
  UserCheck,
  Lock,
  DollarSign
} from 'lucide-react';
import './styles.css';
import './auth.css';
import './forms.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type UserRole = 'Admin' | 'Sales' | 'Warehouse' | 'Accounts';

type User = { id: number; name: string; email: string; role: UserRole; created_at?: string };

type Customer = {
  id: number;
  name: string;
  mobile: string;
  email?: string;
  business_name?: string;
  gst_number?: string;
  customer_type: 'Retail' | 'Wholesale' | 'Distributor';
  address?: string;
  status: 'Lead' | 'Active' | 'Inactive';
  follow_up_date?: string;
  notes?: string;
  created_at: string;
};

type Followup = {
  id: number;
  customer_id: number;
  note: string;
  follow_up_date?: string;
  created_by_name?: string;
  created_at: string;
};

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  unit_price: number;
  current_stock: number;
  min_stock_alert: number;
  warehouse_location?: string;
  low_stock?: boolean;
};

type ChallanItem = {
  id?: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  unit_price?: number;
  quantity: number;
};

type Challan = {
  id: number;
  challan_number: string;
  customer_id: number;
  customer_name?: string;
  customer_mobile?: string;
  customer_email?: string;
  business_name?: string;
  gst_number?: string;
  customer_address?: string;
  total_quantity: number;
  status: 'Draft' | 'Confirmed' | 'Cancelled';
  created_by_name?: string;
  created_at: string;
  items?: ChallanItem[];
};

async function api(path: string, method = 'GET', body?: unknown) {
  const r = await fetch(API + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.token || ''}`
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const d = await r.json();
  if (!r.ok) {
    throw new Error(d.message || (d.errors ? d.errors.map((e: any) => e.msg || e.path).join(', ') : 'Request failed.'));
  }
  return d;
}

function Modal({ title, onClose, children, large }: { title: string; onClose: () => void; children: any; large?: boolean }) {
  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className={`modal ${large ? 'large' : ''}`}>
        <button className="icon-button" type="button" onClick={onClose}><X size={19} /></button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return text ? <p className="success toast">{text}</p> : null;
}

function Table({ heads, rows }: { heads: string[]; rows: any[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{heads.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
            ))
          ) : (
            <tr><td colSpan={heads.length} className="empty">No records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ==================== AUTHENTICATION (DISTINCT ADMIN VS USER LOGIN) ==================== */
function Login({ setUser }: { setUser: (u: User) => void }) {
  const nav = useNavigate();
  const [loginType, setLoginType] = useState<'admin' | 'staff'>('admin');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@fundsroom.local');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  function selectLoginType(type: 'admin' | 'staff') {
    setLoginType(type);
    setError('');
    setNote('');
    if (type === 'admin') {
      setEmail('admin@fundsroom.local');
      setPassword('Password@123');
      setMode('login');
    } else {
      setEmail('sales@fundsroom.local');
      setPassword('Password@123');
    }
  }

  function fillRole(roleEmail: string) {
    setEmail(roleEmail);
    setPassword('Password@123');
    setError('');
    setNote(`Selected ${roleEmail.split('@')[0].toUpperCase()} credentials`);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNote('');
    try {
      if (mode === 'register') {
        await api('/auth/register', 'POST', { name, email, password });
        setNote('Staff account registered! You can now sign in.');
        setMode('login');
        setPassword('');
      } else {
        const d = await api('/auth/login', 'POST', { email, password });
        localStorage.token = d.token;
        setUser(d.user);
        nav('/');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login">
      {/* LEFT COLUMN: HERO & ROLE SELECTION */}
      <section>
        <span className="eyebrow">FUNDSROOM DISTRIBUTION ENTERPRISE</span>
        <h1>Operations Portal & ERP/CRM Workspace</h1>
        <p>A unified cloud platform engineered for wholesale distribution. Distinct access tiers guarantee streamlined workflow execution for executive administrators, sales representatives, warehouse controllers, and audit accountants.</p>

        <div style={{ marginTop: 28, background: 'rgba(255,255,255,0.06)', padding: 22, borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#83d1a9', fontSize: 13 }}>
            <Sparkles size={16} /> Instant Role Access Selectors (Click to Load):
          </strong>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={() => { selectLoginType('admin'); fillRole('admin@fundsroom.local'); }}
              style={{
                background: loginType === 'admin' ? '#7c3aed' : '#214638',
                fontSize: 12,
                padding: '10px 12px',
                textAlign: 'left',
                borderRadius: 8,
                border: loginType === 'admin' ? '1px solid #c4b5fd' : 'none'
              }}
            >
              👑 <strong>Executive Admin</strong>
              <div style={{ opacity: 0.8, fontSize: 11 }}>Full portal & user management</div>
            </button>
            <button
              type="button"
              onClick={() => { selectLoginType('staff'); fillRole('sales@fundsroom.local'); }}
              style={{
                background: (loginType === 'staff' && email === 'sales@fundsroom.local') ? '#059669' : '#214638',
                fontSize: 12,
                padding: '10px 12px',
                textAlign: 'left',
                borderRadius: 8
              }}
            >
              💼 <strong>Sales Rep</strong>
              <div style={{ opacity: 0.8, fontSize: 11 }}>CRM clients & challan orders</div>
            </button>
            <button
              type="button"
              onClick={() => { selectLoginType('staff'); fillRole('warehouse@fundsroom.local'); }}
              style={{
                background: (loginType === 'staff' && email === 'warehouse@fundsroom.local') ? '#d97706' : '#214638',
                fontSize: 12,
                padding: '10px 12px',
                textAlign: 'left',
                borderRadius: 8
              }}
            >
              📦 <strong>Warehouse Staff</strong>
              <div style={{ opacity: 0.8, fontSize: 11 }}>Stock levels & movements</div>
            </button>
            <button
              type="button"
              onClick={() => { selectLoginType('staff'); fillRole('accounts@fundsroom.local'); }}
              style={{
                background: (loginType === 'staff' && email === 'accounts@fundsroom.local') ? '#0284c7' : '#214638',
                fontSize: 12,
                padding: '10px 12px',
                textAlign: 'left',
                borderRadius: 8
              }}
            >
              📊 <strong>Accounts Auditor</strong>
              <div style={{ opacity: 0.8, fontSize: 11 }}>Read-only audits & invoices</div>
            </button>
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: LOGIN FORM WITH TABS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <form onSubmit={submit} style={{ width: '100%', maxWidth: 460 }}>
          {/* TAB SWITCHER: ADMIN ACCESS VS USER ACCESS */}
          <div style={{ display: 'flex', borderBottom: '2px solid #e2e8e4', marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => selectLoginType('admin')}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'transparent',
                color: loginType === 'admin' ? '#7c3aed' : '#64746d',
                border: 'none',
                borderBottom: loginType === 'admin' ? '3px solid #7c3aed' : '3px solid transparent',
                borderRadius: 0,
                boxShadow: 'none',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              <Shield size={16} /> Admin Portal
            </button>
            <button
              type="button"
              onClick={() => selectLoginType('staff')}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'transparent',
                color: loginType === 'staff' ? '#196f50' : '#64746d',
                border: 'none',
                borderBottom: loginType === 'staff' ? '3px solid #196f50' : '3px solid transparent',
                borderRadius: 0,
                boxShadow: 'none',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              <Users size={16} /> Staff / User Portal
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            {loginType === 'admin' ? (
              <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={14} /> Executive Admin Access
              </span>
            ) : (
              <span style={{ background: '#e8f5ed', color: '#196f50', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <UserCheck size={14} /> Department Staff Workspace
              </span>
            )}
          </div>

          <h2>{mode === 'login' ? (loginType === 'admin' ? 'Sign In as Administrator' : 'Sign In as Staff Member') : 'Register Staff Account'}</h2>
          <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
            {loginType === 'admin'
              ? 'Enter master administrator credentials to access the command center.'
              : 'Enter employee credentials for Sales, Warehouse, or Accounts.'}
          </p>

          {error && <p className="error">{error}</p>}
          {note && <p className="success">{note}</p>}

          {mode === 'register' && (
            <label>Full Name *<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Sharma" required /></label>
          )}

          <label>
            Email Address *
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder={loginType === 'admin' ? 'admin@fundsroom.local' : 'sales@fundsroom.local'}
              required
            />
          </label>

          <label>
            Password *
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                minLength={8}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: 4,
                  background: 'transparent',
                  border: 'none',
                  color: '#65756d',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'none'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 14,
              background: loginType === 'admin' ? '#7c3aed' : '#196f50'
            }}
          >
            {loading ? 'Authenticating…' : mode === 'login' ? (loginType === 'admin' ? 'Enter Admin Command Center' : 'Access Staff Workspace') : 'Register Staff Account'}
          </button>

          {loginType === 'staff' && (
            <button type="button" className="link-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'New employee? Register here' : 'Already registered? Sign in'}
            </button>
          )}
        </form>
      </div>
    </main>
  );
}

/* ==================== MAIN SHELL (DIFFERENT SIDEBAR ACCORDING TO ROLE) ==================== */
function Shell({ user, setUser }: { user: User; setUser: (u: any) => void }) {
  const nav = useNavigate();

  // Distinct navigation links based on user role
  const links = useMemo(() => {
    if (user.role === 'Admin') {
      return [
        ['/', LayoutDashboard, 'Admin Dashboard'],
        ['/customers', Users, 'Customer CRM'],
        ['/products', Package, 'Inventory & Stock'],
        ['/challans', ClipboardList, 'Sales Challans'],
        ['/movements', Box, 'Stock Audit Log'],
        ['/admin/users', Shield, 'Team & Roles (Admin)']
      ];
    } else if (user.role === 'Sales') {
      return [
        ['/', LayoutDashboard, 'Sales Dashboard'],
        ['/customers', Users, 'Clients & CRM'],
        ['/challans', ClipboardList, 'Sales Challans'],
        ['/products', Package, 'Catalog Lookup']
      ];
    } else if (user.role === 'Warehouse') {
      return [
        ['/', LayoutDashboard, 'Logistics Dashboard'],
        ['/products', Package, 'Stock Management'],
        ['/movements', Box, 'Goods In/Out Log']
      ];
    } else {
      // Accounts
      return [
        ['/', LayoutDashboard, 'Auditor Dashboard'],
        ['/challans', ClipboardList, 'Invoices & Challans'],
        ['/customers', Users, 'Accounts Directory'],
        ['/products', Package, 'Asset Valuation'],
        ['/movements', Box, 'Audit Logs']
      ];
    }
  }, [user.role]);

  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <Box /> Fundsroom <span>{user.role === 'Admin' ? 'Admin' : 'Portal'}</span>
        </div>
        <span className={`role-badge ${user.role.toLowerCase()}`}>
          {user.role === 'Admin' ? '👑 Executive Admin' : `${user.role} Workspace`}
        </span>
        <nav>
          {links.map(([to, Icon, label]: any) => (
            <NavLink key={to} to={to} end>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <div style={{ fontSize: 12, color: '#9bb4a8', marginBottom: 12, wordBreak: 'break-all' }}>
            Active User: <strong>{user.email}</strong>
          </div>
          <button className="signout" onClick={() => { localStorage.clear(); setUser(null); nav('/login'); }}>
            <LogOut size={16} />Sign Out
          </button>
        </div>
      </aside>

      <main className="content">
        <header>
          <div>
            <p className="eyebrow">
              {user.role === 'Admin'
                ? 'EXECUTIVE OPERATIONS CONTROL CENTER'
                : `${user.role.toUpperCase()} OPERATIONS CONSOLE`}
            </p>
            <h1>
              {user.role === 'Admin' ? `Admin Console — ${user.name}` : `Welcome back, ${user.name}`}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className={`pill ${user.role.toLowerCase()}`} style={{ fontSize: 12, fontWeight: 700 }}>
              ● {user.role} Access
            </span>
            <div className="avatar" style={{
              background: user.role === 'Admin' ? '#ede9fe' : '#e8f5ed',
              color: user.role === 'Admin' ? '#7c3aed' : '#196f50',
              border: user.role === 'Admin' ? '2px solid #c4b5fd' : '2px solid #bce1ce'
            }}>
              {user.name[0]}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/customers" element={<Customers user={user} />} />
          <Route path="/products" element={<Products user={user} />} />
          <Route path="/challans" element={<Challans user={user} />} />
          <Route path="/movements" element={<Movements user={user} />} />
          {user.role === 'Admin' && <Route path="/admin/users" element={<AdminUserManagement user={user} />} />}
        </Routes>
      </main>
    </div>
  );
}

/* ==================== DASHBOARDS (DIFFERENT FOR ADMIN VS USER) ==================== */
function Dashboard({ user }: { user: User }) {
  const [d, setD] = useState<any>();
  const [recentMovements, setRecentMovements] = useState<any[]>([]);
  const [recentChallans, setRecentChallans] = useState<any[]>([]);

  useEffect(() => {
    api('/dashboard').then(setD).catch(() => {});
    api('/stock-movements').then(m => setRecentMovements(m.slice(0, 5))).catch(() => {});
    api('/challans').then(ch => setRecentChallans(ch.slice(0, 5))).catch(() => {});
  }, []);

  const isAdmin = user.role === 'Admin';

  return (
    <>
      {/* DISTINCT HERO BANNER FOR ADMIN VS REGULAR USERS */}
      <div
        className="hero"
        style={{
          background: isAdmin
            ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
            : 'linear-gradient(135deg, #e3f2e8 0%, #edf7f0 100%)',
          borderColor: isAdmin ? '#ddd6fe' : '#c9e4d3'
        }}
      >
        <div>
          <h2 style={{ color: isAdmin ? '#4c1d95' : '#102a22' }}>
            {isAdmin ? 'Executive Administration & Oversight' : `${user.role} Workspace Overview`}
          </h2>
          <p>
            {isAdmin
              ? 'Complete operational transparency across CRM client acquisition, warehouse logistics, dispatches, and team governance.'
              : user.role === 'Sales'
              ? 'Focus on closing wholesale clients, managing follow-up pipelines, and dispatching sales challans.'
              : user.role === 'Warehouse'
              ? 'Monitor stock availability, fulfill incoming dispatches, and restock low-inventory items.'
              : 'Audit order accuracy, verify customer GST credentials, and review historical delivery notes.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isAdmin && (
            <Link className="button" to="/admin/users" style={{ background: '#7c3aed' }}>
              <Shield size={16} /> Manage Roles
            </Link>
          )}
          {['Admin', 'Sales'].includes(user.role) && (
            <Link className="button" to="/challans">
              <Plus size={16} /> New Challan
            </Link>
          )}
          {['Admin', 'Warehouse'].includes(user.role) && (
            <Link className="button btn-secondary" to="/products">
              <Package size={16} /> Inventory
            </Link>
          )}
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="stats">
        <article>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Users size={22} />
            <span style={{ fontSize: 11, color: '#15803d', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: 12 }}>
              CRM
            </span>
          </div>
          <p>Total Customers</p>
          <strong>{d?.customers ?? '—'}</strong>
          <div style={{ fontSize: 11.5, color: '#82938a', marginTop: 4 }}>Registered wholesale & retail</div>
        </article>

        <article>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Package size={22} />
            <span style={{ fontSize: 11, color: '#15803d', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: 12 }}>
              Catalog
            </span>
          </div>
          <p>Active Products</p>
          <strong>{d?.products ?? '—'}</strong>
          <div style={{ fontSize: 11.5, color: '#82938a', marginTop: 4 }}>Tracked SKUs in warehouse</div>
        </article>

        <article>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ClipboardList size={22} />
            <span style={{ fontSize: 11, color: '#0369a1', fontWeight: 700, background: '#e0f2fe', padding: '2px 8px', borderRadius: 12 }}>
              Dispatched
            </span>
          </div>
          <p>Confirmed Challans</p>
          <strong>{d?.confirmed_challans ?? '—'}</strong>
          <div style={{ fontSize: 11.5, color: '#82938a', marginTop: 4 }}>Delivered & stock reduced</div>
        </article>

        <article>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <AlertTriangle size={22} />
            <span style={{ fontSize: 11, color: '#b91c1c', fontWeight: 700, background: '#fee2e2', padding: '2px 8px', borderRadius: 12 }}>
              Alert
            </span>
          </div>
          <p>Low Stock Items</p>
          <strong style={{ color: Number(d?.low_stock) > 0 ? '#b91c1c' : '#17201d' }}>{d?.low_stock ?? '—'}</strong>
          <div style={{ fontSize: 11.5, color: '#82938a', marginTop: 4 }}>Below minimum reorder limit</div>
        </article>
      </div>

      {/* DUAL ACTIVITY PANELS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="panel" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <Clock size={18} /> Recent Stock Movements
            </h3>
            <Link to="/movements" style={{ fontSize: 12, color: '#196f50', fontWeight: 600, textDecoration: 'none' }}>
              View All &rarr;
            </Link>
          </div>
          {recentMovements.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentMovements.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f9fbf9', borderRadius: 8, border: '1px solid #edf2ee', fontSize: 13 }}>
                  <div>
                    <strong>{m.product_name}</strong>
                    <div style={{ fontSize: 11, color: '#65756d' }}>{m.reason} · by {m.created_by_name || 'System'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={'direction ' + m.movement_type.toLowerCase()}>{m.movement_type} {m.quantity_changed}</span>
                    <div style={{ fontSize: 10, color: '#95a39c', marginTop: 2 }}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No recent movements.</p>
          )}
        </div>

        <div className="panel" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <FileText size={18} /> Recent Sales Challans
            </h3>
            <Link to="/challans" style={{ fontSize: 12, color: '#196f50', fontWeight: 600, textDecoration: 'none' }}>
              View All &rarr;
            </Link>
          </div>
          {recentChallans.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentChallans.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f9fbf9', borderRadius: 8, border: '1px solid #edf2ee', fontSize: 13 }}>
                  <div>
                    <strong style={{ fontFamily: 'monospace' }}>{c.challan_number}</strong>
                    <div style={{ fontSize: 11, color: '#65756d' }}>{c.customer_name} · {c.total_quantity} units</div>
                  </div>
                  <span className={'pill ' + c.status.toLowerCase()}>{c.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No recent challans generated.</p>
          )}
        </div>
      </div>
    </>
  );
}

/* ==================== ADMIN EXCLUSIVE: USER MANAGEMENT & ROLES ==================== */
function AdminUserManagement({ user }: { user: User }) {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    api('/users').then(setUsersList).catch(e => setError(e.message));
  };

  useEffect(() => {
    void load();
  }, []);

  async function updateRole(targetId: number, newRole: UserRole) {
    try {
      await api(`/users/${targetId}/role`, 'PUT', { role: newRole });
      setNote(`User role successfully updated to ${newRole}.`);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h2>Team Member & Role Governance (Admin Only)</h2>
          <p>Supervise user access, assign security privileges, and control organizational roles.</p>
        </div>
      </div>

      <Notice text={note} />
      {error && <p className="error toast">{error}</p>}

      <div className="panel" style={{ marginTop: 0, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Shield size={24} style={{ color: '#7c3aed' }} />
          <div>
            <strong style={{ fontSize: 14 }}>Role-Based Access Policy:</strong>
            <div style={{ fontSize: 12.5, color: '#65756d', marginTop: 2 }}>
              • <strong>Admin:</strong> Master authority over CRM, Products, Orders, and User Permissions.<br/>
              • <strong>Sales:</strong> Focused on Customer Leads, Wholesale Accounts, and Outbound Challans.<br/>
              • <strong>Warehouse:</strong> Responsible for Stock Auditing, Minimum Reorder Alerts, and Goods Inward.<br/>
              • <strong>Accounts:</strong> Read-only financial audits and delivery invoice verifications.
            </div>
          </div>
        </div>
      </div>

      <Table
        heads={['User ID', 'Full Name', 'Email Address', 'Current Role', 'Reassign Role', 'Created Date']}
        rows={usersList.map(u => [
          <code>USR-{u.id}</code>,
          <strong>{u.name}</strong>,
          u.email,
          <span className={`pill ${u.role.toLowerCase()}`}>{u.role}</span>,
          <div>
            <select
              value={u.role}
              onChange={e => updateRole(u.id, e.target.value as UserRole)}
              style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}
            >
              <option value="Admin">Admin</option>
              <option value="Sales">Sales</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Accounts">Accounts</option>
            </select>
          </div>,
          u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'
        ])}
      />
    </>
  );
}

/* ==================== CUSTOMER CRM MODULE ==================== */
function Customers({ user }: { user: User }) {
  const [items, setItems] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'detail' | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDetail, setCustomerDetail] = useState<any>(null);
  const [newNote, setNewNote] = useState('');
  const [newFollowupDate, setNewFollowupDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const canEdit = ['Admin', 'Sales'].includes(user.role);

  const load = () => {
    api('/customers?limit=50&search=' + encodeURIComponent(search))
      .then(d => setItems(d.data))
      .catch(e => setError(e.message));
  };

  useEffect(() => {
    void load();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(c => {
      const matchType = filterType === 'All' || c.customer_type === filterType;
      const matchStatus = filterStatus === 'All' || c.status === filterStatus;
      return matchType && matchStatus;
    });
  }, [items, filterType, filterStatus]);

  async function openDetail(c: Customer) {
    setSelectedCustomer(c);
    try {
      const full = await api(`/customers/${c.id}`);
      setCustomerDetail(full);
      setOpenModal('detail');
    } catch (e: any) {
      setError(e.message);
    }
  }

  function startEdit(c: Customer) {
    setSelectedCustomer(c);
    setOpenModal('edit');
  }

  async function saveCustomer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const body: Record<string, any> = Object.fromEntries(form);

    try {
      if (openModal === 'edit' && selectedCustomer) {
        await api(`/customers/${selectedCustomer.id}`, 'PUT', body);
        setNote('Customer profile updated successfully.');
      } else {
        await api('/customers', 'POST', body);
        setNote('New customer registered successfully.');
      }
      setOpenModal(null);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function addFollowup(e: FormEvent) {
    e.preventDefault();
    if (!selectedCustomer || !newNote.trim()) return;
    try {
      await api(`/customers/${selectedCustomer.id}/followups`, 'POST', {
        note: newNote,
        follow_up_date: newFollowupDate || undefined
      });
      setNewNote('');
      setNewFollowupDate('');
      const updated = await api(`/customers/${selectedCustomer.id}`);
      setCustomerDetail(updated);
      setNote('Follow-up interaction logged.');
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h2>Customer Relationship Management (CRM)</h2>
          <p>Client accounts, wholesale distributor agreements, GSTIN validations, and follow-up pipelines.</p>
        </div>
        {canEdit && (
          <button onClick={() => { setSelectedCustomer(null); setOpenModal('add'); }}>
            <Plus size={16} /> Add Customer
          </button>
        )}
      </div>

      <Notice text={note} />
      {error && <p className="error toast">{error}</p>}

      <div className="toolbar">
        <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
          <input
            placeholder="Search by customer name or company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') load(); }}
          />
        </div>
        <button onClick={load} className="btn-secondary"><Search size={16} /> Search</button>

        {/* FILTER CHIPS */}
        <div className="filter-chips" style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: 12, color: '#65756d', fontWeight: 600 }}>Type:</span>
          {['All', 'Retail', 'Wholesale', 'Distributor'].map(t => (
            <span
              key={t}
              className={`chip ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}
            >
              {t}
            </span>
          ))}
          <span style={{ fontSize: 12, color: '#65756d', fontWeight: 600, marginLeft: 8 }}>Status:</span>
          {['All', 'Lead', 'Active', 'Inactive'].map(s => (
            <span
              key={s}
              className={`chip ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <Table
        heads={['Customer / Contact', 'Business & GSTIN', 'Customer Type', 'Status', 'Next Follow-Up', 'Actions']}
        rows={filteredItems.map(x => [
          <div>
            <strong>{x.name}</strong>
            <div style={{ fontSize: 12, color: '#65756d', display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
              <span><Phone size={12} style={{ verticalAlign: 'middle' }} /> {x.mobile}</span>
              {x.email && <span><Mail size={12} style={{ verticalAlign: 'middle' }} /> {x.email}</span>}
            </div>
          </div>,
          <div>
            <div style={{ fontWeight: 600 }}>{x.business_name || '—'}</div>
            {x.gst_number ? (
              <div style={{ fontSize: 11, color: '#196f50', fontFamily: 'monospace', fontWeight: 700 }}>
                GSTIN: {x.gst_number}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: '#899991' }}>Unregistered</div>
            )}
          </div>,
          <span style={{ fontWeight: 600 }}>{x.customer_type}</span>,
          <span className={'pill ' + x.status.toLowerCase()}>{x.status}</span>,
          x.follow_up_date ? new Date(x.follow_up_date).toLocaleDateString() : '—',
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openDetail(x)}>
              <Eye size={14} /> Profile
            </button>
            {canEdit && (
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => startEdit(x)}>
                <Edit2 size={14} /> Edit
              </button>
            )}
          </div>
        ])}
      />

      {/* ADD / EDIT CUSTOMER MODAL */}
      {(openModal === 'add' || openModal === 'edit') && (
        <Modal title={openModal === 'edit' ? 'Edit Customer Information' : 'Register New Customer'} onClose={() => setOpenModal(null)}>
          <form className="form-grid" onSubmit={saveCustomer}>
            <label>
              Customer Name *
              <input name="name" defaultValue={selectedCustomer?.name || ''} required placeholder="Full contact name" />
            </label>
            <label>
              Mobile Phone *
              <input name="mobile" defaultValue={selectedCustomer?.mobile || ''} required placeholder="10-digit mobile" />
            </label>
            <label>
              Email Address
              <input name="email" type="email" defaultValue={selectedCustomer?.email || ''} placeholder="name@company.in" />
            </label>
            <label>
              Business / Entity Name
              <input name="business_name" defaultValue={selectedCustomer?.business_name || ''} placeholder="Registered trading name" />
            </label>
            <label>
              GST Number (Optional)
              <input name="gst_number" defaultValue={selectedCustomer?.gst_number || ''} placeholder="e.g. 27AAAAA0000A1Z5" />
            </label>
            <label>
              Customer Type
              <select name="customer_type" defaultValue={selectedCustomer?.customer_type || 'Retail'}>
                <option value="Retail">Retail Store</option>
                <option value="Wholesale">Wholesale Merchant</option>
                <option value="Distributor">Primary Distributor</option>
              </select>
            </label>
            <label>
              Pipeline Status
              <select name="status" defaultValue={selectedCustomer?.status || 'Lead'}>
                <option value="Lead">Lead (Exploring)</option>
                <option value="Active">Active (Transacting)</option>
                <option value="Inactive">Inactive (Dormant)</option>
              </select>
            </label>
            <label>
              Scheduled Follow-Up Date
              <input
                name="follow_up_date"
                type="date"
                defaultValue={selectedCustomer?.follow_up_date ? selectedCustomer.follow_up_date.slice(0, 10) : ''}
              />
            </label>
            <label className="wide">
              Billing & Delivery Address
              <input name="address" defaultValue={selectedCustomer?.address || ''} placeholder="Full address with PIN code" />
            </label>
            <label className="wide">
              Initial Notes / Payment Terms
              <textarea name="notes" defaultValue={selectedCustomer?.notes || ''} placeholder="e.g. 30 days credit limit, requires freight delivery..." />
            </label>
            <button className="wide" style={{ marginTop: 10 }}>
              {openModal === 'edit' ? 'Update Customer Record' : 'Save Customer to Database'}
            </button>
          </form>
        </Modal>
      )}

      {/* CUSTOMER DETAIL & FOLLOW-UPS MODAL */}
      {openModal === 'detail' && selectedCustomer && customerDetail && (
        <Modal title={`Customer Profile — ${customerDetail.name}`} onClose={() => setOpenModal(null)} large>
          <div className="detail-card">
            <div className="detail-grid">
              <div><strong>Business Name:</strong> <span>{customerDetail.business_name || 'Individual Trader'}</span></div>
              <div><strong>GSTIN:</strong> <span style={{ fontFamily: 'monospace' }}>{customerDetail.gst_number || 'Not Registered'}</span></div>
              <div><strong>Primary Mobile:</strong> <span>{customerDetail.mobile}</span></div>
              <div><strong>Email:</strong> <span>{customerDetail.email || '—'}</span></div>
              <div><strong>Customer Type:</strong> <span>{customerDetail.customer_type}</span></div>
              <div><strong>Status:</strong> <span className={'pill ' + customerDetail.status.toLowerCase()}>{customerDetail.status}</span></div>
              <div><strong>Scheduled Follow-Up:</strong> <span>{customerDetail.follow_up_date ? new Date(customerDetail.follow_up_date).toLocaleDateString() : 'No pending date'}</span></div>
              <div><strong>Customer Since:</strong> <span>{new Date(customerDetail.created_at).toLocaleDateString()}</span></div>
              <div style={{ gridColumn: 'span 2' }}><strong>Address:</strong> <span>{customerDetail.address || '—'}</span></div>
              <div style={{ gridColumn: 'span 2' }}><strong>Account Notes:</strong> <span>{customerDetail.notes || '—'}</span></div>
            </div>
          </div>

          <h3 style={{ marginTop: 24, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={18} /> Interaction History & Follow-Up Log ({customerDetail.followups?.length || 0})
          </h3>

          {canEdit && (
            <form onSubmit={addFollowup} style={{ background: '#f8faf9', padding: 18, borderRadius: 10, marginTop: 12, border: '1px solid #e3e8e5' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                Log Call / Meeting / Negotiation Note:
              </label>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Document discussion points, orders discussed, quotations shared, or client feedback..."
                required
                style={{ width: '100%', minHeight: 70, padding: 12, borderRadius: 8, border: '1px solid #dbe1dd' }}
              />
              <div style={{ display: 'flex', gap: 14, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                  Reschedule Next Follow-Up Date:
                  <input
                    type="date"
                    value={newFollowupDate}
                    onChange={e => setNewFollowupDate(e.target.value)}
                    style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}
                  />
                </label>
                <button style={{ marginLeft: 'auto', padding: '8px 18px', fontSize: 13 }}>
                  <Plus size={14} /> Record Interaction
                </button>
              </div>
            </form>
          )}

          <div className="timeline">
            {customerDetail.followups && customerDetail.followups.length > 0 ? (
              customerDetail.followups.map((f: Followup) => (
                <div key={f.id} className="timeline-item">
                  <div className="timeline-meta">
                    <strong>{f.created_by_name || 'Staff Member'}</strong>
                    <span>{new Date(f.created_at).toLocaleString()}</span>
                  </div>
                  <div className="timeline-note">{f.note}</div>
                  {f.follow_up_date && (
                    <div style={{ fontSize: 11.5, color: '#15803d', fontWeight: 700, marginTop: 4 }}>
                      🗓️ Scheduled next follow-up: {new Date(f.follow_up_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="muted" style={{ padding: 16, textAlign: 'center' }}>No follow-up notes logged yet. Log the first interaction above.</p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

/* ==================== PRODUCT & INVENTORY MODULE ==================== */
function Products({ user }: { user: User }) {
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'restock' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(10);
  const [restockReason, setRestockReason] = useState('Vendor shipment restock');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const canManage = ['Admin', 'Warehouse'].includes(user.role);

  const load = () => {
    api('/products?search=' + encodeURIComponent(search))
      .then(setItems)
      .catch(e => setError(e.message));
  };

  useEffect(() => {
    void load();
  }, []);

  const filteredItems = useMemo(() => {
    if (showLowStockOnly) {
      return items.filter(p => p.current_stock <= p.min_stock_alert);
    }
    return items;
  }, [items, showLowStockOnly]);

  function startEdit(p: Product) {
    setSelectedProduct(p);
    setOpenModal('edit');
  }

  function startRestock(p: Product) {
    setSelectedProduct(p);
    setRestockQty(10);
    setRestockReason(`Restock batch for ${p.sku}`);
    setOpenModal('restock');
  }

  async function saveProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const body: Record<string, any> = {
      name: form.get('name'),
      sku: form.get('sku'),
      category: form.get('category'),
      unit_price: parseFloat(form.get('unit_price') as string),
      current_stock: parseInt(form.get('current_stock') as string, 10),
      min_stock_alert: parseInt(form.get('min_stock_alert') as string, 10),
      warehouse_location: form.get('warehouse_location') || null
    };

    try {
      if (openModal === 'edit' && selectedProduct) {
        await api(`/products/${selectedProduct.id}`, 'PUT', body);
        setNote('Product specifications updated successfully.');
      } else {
        await api('/products', 'POST', body);
        setNote('New product added to wholesale catalog.');
      }
      setOpenModal(null);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function submitRestock(e: FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await api('/stock-movements', 'POST', {
        product_id: selectedProduct.id,
        movement_type: 'IN',
        quantity: restockQty,
        reason: restockReason
      });
      setOpenModal(null);
      setNote(`Restocked ${restockQty} units of ${selectedProduct.name}.`);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h2>Products & Warehouse Inventory</h2>
          <p>Wholesale catalog, live on-hand stocks, reorder thresholds, and warehouse shelf assignments.</p>
        </div>
        {canManage && (
          <button onClick={() => { setSelectedProduct(null); setOpenModal('add'); }}>
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      <Notice text={note} />
      {error && <p className="error toast">{error}</p>}

      <div className="toolbar">
        <input
          placeholder="Search catalog by name, SKU, or category…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') load(); }}
          style={{ maxWidth: 360 }}
        />
        <button onClick={load} className="btn-secondary"><Search size={16} /> Search</button>

        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`chip ${showLowStockOnly ? 'active' : ''}`}
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, height: 38 }}
        >
          <AlertTriangle size={14} />
          {showLowStockOnly ? 'Showing Low Stock Only' : 'Filter Low Stock Alert'}
        </button>
      </div>

      <Table
        heads={['Product Name', 'SKU Code', 'Category', 'Unit Price (₹)', 'On-Hand Stock', 'Min Alert', 'Location', 'Actions']}
        rows={filteredItems.map(x => [
          <strong>{x.name}</strong>,
          <code style={{ background: '#edf2ee', padding: '3px 7px', borderRadius: 4, fontFamily: 'monospace' }}>{x.sku}</code>,
          x.category,
          '₹' + Number(x.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          <div>
            <span className={x.current_stock <= x.min_stock_alert ? 'stock low' : 'stock'}>
              {x.current_stock} units {x.current_stock <= x.min_stock_alert ? '· LOW' : ''}
            </span>
          </div>,
          <span>{x.min_stock_alert} units</span>,
          x.warehouse_location || '—',
          <div style={{ display: 'flex', gap: 6 }}>
            {canManage && (
              <>
                <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => startRestock(x)}>
                  + Restock
                </button>
                <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => startEdit(x)}>
                  <Edit2 size={14} /> Edit
                </button>
              </>
            )}
            {!canManage && <span className="muted" style={{ fontSize: 12 }}>Read-only</span>}
          </div>
        ])}
      />

      {/* QUICK RESTOCK MODAL */}
      {openModal === 'restock' && selectedProduct && (
        <Modal title={`Quick Restock — ${selectedProduct.name}`} onClose={() => setOpenModal(null)}>
          <form onSubmit={submitRestock} className="form-grid">
            <div className="wide detail-card" style={{ marginBottom: 4 }}>
              <strong>Current Stock:</strong> {selectedProduct.current_stock} units | <strong>Min Alert:</strong> {selectedProduct.min_stock_alert} units
            </div>
            <label className="wide">
              Restock Quantity (Units) *
              <input
                type="number"
                min="1"
                value={restockQty}
                onChange={e => setRestockQty(parseInt(e.target.value, 10) || 1)}
                required
              />
            </label>
            <label className="wide">
              Restock Reason / PO Reference *
              <input
                value={restockReason}
                onChange={e => setRestockReason(e.target.value)}
                required
                placeholder="e.g. PO-2026-880 supplier batch inward"
              />
            </label>
            <button className="wide" style={{ marginTop: 10 }}>Confirm Inward Restock</button>
          </form>
        </Modal>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {(openModal === 'add' || openModal === 'edit') && (
        <Modal title={openModal === 'edit' ? 'Edit Product Details' : 'Add New Catalog Product'} onClose={() => setOpenModal(null)}>
          <form className="form-grid" onSubmit={saveProduct}>
            <label className="wide">
              Product Name *
              <input name="name" defaultValue={selectedProduct?.name || ''} required placeholder="e.g. Heavy Duty Pipe" />
            </label>
            <label>
              SKU / Code *
              <input name="sku" defaultValue={selectedProduct?.sku || ''} required placeholder="e.g. HDP-100" />
            </label>
            <label>
              Category *
              <input name="category" defaultValue={selectedProduct?.category || ''} required placeholder="e.g. Plumbing, Safety" />
            </label>
            <label>
              Unit Price (₹) *
              <input name="unit_price" type="number" step="0.01" min="0" defaultValue={selectedProduct?.unit_price || ''} required placeholder="0.00" />
            </label>
            <label>
              Opening / Current Stock *
              <input name="current_stock" type="number" min="0" defaultValue={selectedProduct?.current_stock ?? 0} required />
            </label>
            <label>
              Minimum Stock Alert Threshold *
              <input name="min_stock_alert" type="number" min="0" defaultValue={selectedProduct?.min_stock_alert ?? 5} required />
            </label>
            <label className="wide">
              Warehouse Storage Location
              <input name="warehouse_location" defaultValue={selectedProduct?.warehouse_location || ''} placeholder="e.g. Warehouse A, Bay 2, Rack 4" />
            </label>
            <button className="wide" style={{ marginTop: 10 }}>
              {openModal === 'edit' ? 'Update Product Specifications' : 'Add Product to Catalog'}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

/* ==================== STOCK MOVEMENT LOG ==================== */
function Movements({ user }: { user: User }) {
  const [items, setItems] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterDirection, setFilterDirection] = useState<'All' | 'IN' | 'OUT'>('All');
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const canRecord = ['Admin', 'Warehouse'].includes(user.role);

  const load = () => {
    api('/stock-movements').then(setItems).catch(e => setError(e.message));
  };

  useEffect(() => {
    void load();
    api('/products').then(setProducts).catch(() => {});
  }, []);

  const filteredItems = useMemo(() => {
    if (filterDirection === 'All') return items;
    return items.filter(m => m.movement_type === filterDirection);
  }, [items, filterDirection]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      await api('/stock-movements', 'POST', {
        product_id: Number(form.get('product_id')),
        movement_type: form.get('movement_type'),
        quantity: Number(form.get('quantity')),
        reason: form.get('reason')
      });
      setOpen(false);
      setNote('Stock movement logged.');
      load();
      api('/products').then(setProducts).catch(() => {});
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h2>Stock Movement Audit Trail</h2>
          <p>Tamper-evident audit log of every stock intake, dispatch, return, and inventory reconciliation.</p>
        </div>
        {canRecord && (
          <button onClick={() => setOpen(true)}>
            <Plus size={16} /> Record Movement
          </button>
        )}
      </div>

      <Notice text={note} />
      {error && <p className="error toast">{error}</p>}

      <div className="toolbar">
        <div className="filter-chips">
          <span style={{ fontSize: 12, color: '#65756d', fontWeight: 600 }}>Direction:</span>
          {(['All', 'IN', 'OUT'] as const).map(d => (
            <span
              key={d}
              className={`chip ${filterDirection === d ? 'active' : ''}`}
              onClick={() => setFilterDirection(d)}
            >
              {d === 'All' ? 'All Movements' : d === 'IN' ? '↓ Inward (Restock)' : '↑ Outward (Dispatch)'}
            </span>
          ))}
        </div>
      </div>

      <Table
        heads={['Product & SKU', 'Movement Direction', 'Quantity', 'Reason / Source Reference', 'Logged By', 'Timestamp']}
        rows={filteredItems.map(x => [
          <div>
            <strong>{x.product_name}</strong>
            <div style={{ fontSize: 11, color: '#65756d', fontFamily: 'monospace' }}>{x.sku}</div>
          </div>,
          <span className={'direction ' + x.movement_type.toLowerCase()}>
            {x.movement_type === 'IN' ? '↓ IN' : '↑ OUT'}
          </span>,
          <strong>{x.quantity_changed} units</strong>,
          x.reason,
          x.created_by_name || 'System / Automated',
          new Date(x.created_at).toLocaleString()
        ])}
      />

      {open && (
        <Modal title="Record Manual Stock Movement" onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={save}>
            <label className="wide">
              Select Product *
              <select name="product_id" required>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) — Available: {p.current_stock}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Movement Direction *
              <select name="movement_type" required>
                <option value="IN">IN (Goods Received / Restock)</option>
                <option value="OUT">OUT (Manual Dispatch / Scrap / Return)</option>
              </select>
            </label>
            <label>
              Quantity *
              <input name="quantity" type="number" min="1" required defaultValue="1" />
            </label>
            <label className="wide">
              Reason / Source Reference *
              <input name="reason" required placeholder="e.g. Supplier Batch Inward #9821, damaged stock deduction..." />
            </label>
            <button className="wide" style={{ marginTop: 10 }}>Commit Movement Log</button>
          </form>
        </Modal>
      )}
    </>
  );
}

/* ==================== SALES CHALLAN MODULE ==================== */
function Challans({ user }: { user: User }) {
  const [items, setItems] = useState<Challan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Draft'>('All');
  const [openCreate, setOpenCreate] = useState(false);
  const [viewChallan, setViewChallan] = useState<Challan | null>(null);
  const [challanRows, setChallanRows] = useState<{ product_id: number; quantity: number }[]>([
    { product_id: 0, quantity: 1 }
  ]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const canCreate = ['Admin', 'Sales'].includes(user.role);

  const load = () => {
    api('/challans').then(setItems).catch(e => setError(e.message));
  };

  useEffect(() => {
    void load();
    api('/customers?limit=100').then(d => setCustomers(d.data)).catch(() => {});
    api('/products').then(setProducts).catch(() => {});
  }, []);

  const filteredItems = useMemo(() => {
    if (statusFilter === 'All') return items;
    return items.filter(ch => ch.status === statusFilter);
  }, [items, statusFilter]);

  function startCreate() {
    if (products.length > 0) {
      setChallanRows([{ product_id: products[0].id, quantity: 1 }]);
    }
    setOpenCreate(true);
  }

  function addRow() {
    if (products.length > 0) {
      setChallanRows([...challanRows, { product_id: products[0].id, quantity: 1 }]);
    }
  }

  function removeRow(idx: number) {
    setChallanRows(challanRows.filter((_, i) => i !== idx));
  }

  function updateRow(idx: number, field: 'product_id' | 'quantity', val: number) {
    const updated = [...challanRows];
    updated[idx] = { ...updated[idx], [field]: val };
    setChallanRows(updated);
  }

  // Live order calculations
  const totalCalculated = useMemo(() => {
    let subtotal = 0;
    let qty = 0;
    challanRows.forEach(r => {
      const p = products.find(prod => prod.id === r.product_id);
      if (p) {
        subtotal += Number(p.unit_price) * r.quantity;
        qty += r.quantity;
      }
    });
    const gst = subtotal * 0.18;
    return { subtotal, gst, grandTotal: subtotal + gst, qty };
  }, [challanRows, products]);

  async function saveChallan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const customer_id = Number(form.get('customer_id'));
    const status = form.get('status') as string;

    if (challanRows.length === 0) {
      setError('Please add at least one line item to the challan.');
      return;
    }

    try {
      await api('/challans', 'POST', {
        customer_id,
        status,
        items: challanRows.map(r => ({ product_id: r.product_id, quantity: r.quantity }))
      });
      setOpenCreate(false);
      setNote('Sales delivery challan generated successfully.');
      load();
      api('/products').then(setProducts).catch(() => {});
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function openDetail(ch: Challan) {
    try {
      const full = await api(`/challans/${ch.id}`);
      setViewChallan(full);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function confirmDraft(id: number) {
    try {
      await api(`/challans/${id}/confirm`, 'POST');
      setNote('Challan confirmed! Warehouse stock decremented and audit log updated.');
      load();
      const full = await api(`/challans/${id}`);
      setViewChallan(full);
      api('/products').then(setProducts).catch(() => {});
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h2>Sales Challan & Outbound Dispatch Module</h2>
          <p>Generate multi-product delivery challans, check real-time stock balances, and export tax invoices.</p>
        </div>
        {canCreate && (
          <button onClick={startCreate}>
            <Plus size={16} /> New Sales Challan
          </button>
        )}
      </div>

      <Notice text={note} />
      {error && <p className="error toast">{error}</p>}

      <div className="toolbar">
        <div className="filter-chips">
          <span style={{ fontSize: 12, color: '#65756d', fontWeight: 600 }}>Status:</span>
          {(['All', 'Confirmed', 'Draft'] as const).map(s => (
            <span
              key={s}
              className={`chip ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'All' ? 'All Challans' : s}
            </span>
          ))}
        </div>
      </div>

      <Table
        heads={['Challan #', 'Customer Billed', 'Total Quantity', 'Status', 'Generated Date', 'Actions']}
        rows={filteredItems.map(x => [
          <strong style={{ fontFamily: 'monospace', color: '#102a22' }}>{x.challan_number}</strong>,
          <div>
            <strong>{x.customer_name}</strong>
            {x.business_name && <div style={{ fontSize: 11.5, color: '#65756d' }}>{x.business_name}</div>}
          </div>,
          <strong>{x.total_quantity} items</strong>,
          <span className={'pill ' + x.status.toLowerCase()}>{x.status}</span>,
          new Date(x.created_at).toLocaleDateString(),
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openDetail(x)}>
            <Eye size={14} /> View & Print
          </button>
        ])}
      />

      {/* NEW MULTI-PRODUCT CHALLAN MODAL */}
      {openCreate && (
        <Modal title="Generate Multi-Product Sales Delivery Challan" onClose={() => setOpenCreate(false)} large>
          <form className="form-grid" onSubmit={saveChallan}>
            <label className="wide">
              Select Customer Account *
              <select name="customer_id" required>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.business_name ? `${c.business_name} (${c.name})` : c.name} — {c.customer_type} {c.gst_number ? `(GST: ${c.gst_number})` : ''}
                  </option>
                ))}
              </select>
            </label>

            <div className="wide items-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ fontSize: 14, color: '#102a22' }}>Challan Line Items (Add Multiple Products)</strong>
                <button type="button" onClick={addRow} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                  <Plus size={14} /> Add Line Item
                </button>
              </div>

              {challanRows.map((row, idx) => {
                const prod = products.find(p => p.id === row.product_id);
                const isInsufficient = prod && prod.current_stock < row.quantity;
                return (
                  <div key={idx} className="item-row">
                    <div>
                      <select
                        value={row.product_id}
                        onChange={e => updateRow(idx, 'product_id', Number(e.target.value))}
                        required
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku}) — {p.current_stock} in stock (₹{p.unit_price})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={e => updateRow(idx, 'quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                        placeholder="Quantity"
                        required
                      />
                    </div>
                    <div style={{ fontSize: 13, color: isInsufficient ? '#ba3d37' : '#196f50', fontWeight: 600 }}>
                      ₹{prod ? (Number(prod.unit_price) * row.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : 0}
                      {isInsufficient && <div style={{ fontSize: 11 }}>⚠ Low stock! Only {prod?.current_stock} available</div>}
                    </div>
                    <div>
                      {challanRows.length > 1 && (
                        <button type="button" className="btn-remove" onClick={() => removeRow(idx)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* LIVE PRICING SUMMARY */}
              <div style={{ background: '#f8faf9', padding: 14, borderRadius: 8, marginTop: 12, border: '1px solid #e3e8e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#65756d' }}>
                  Total Items: <strong>{totalCalculated.qty} units</strong> | Subtotal: <strong>₹{totalCalculated.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </span>
                <span style={{ fontSize: 14, color: '#102a22', fontWeight: 800 }}>
                  Estimated Total (incl. 18% GST): ₹{totalCalculated.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <label className="wide">
              Challan Status
              <select name="status" defaultValue="Confirmed">
                <option value="Confirmed">Confirmed (Immediately deducts stock & writes audit movement)</option>
                <option value="Draft">Draft (Leaves warehouse stock untouched until confirmed)</option>
              </select>
            </label>

            <button className="wide" style={{ marginTop: 12 }}>
              Generate & Record Sales Challan
            </button>
          </form>
        </Modal>
      )}

      {/* CHALLAN DETAIL & PRINT / PDF MODAL */}
      {viewChallan && (
        <Modal title={`Delivery Challan — ${viewChallan.challan_number}`} onClose={() => setViewChallan(null)} large>
          <div id="printable-challan" style={{ background: '#ffffff', padding: 24, borderRadius: 10, border: '1px solid #e2e8e4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #102a22', paddingBottom: 16, marginBottom: 18 }}>
              <div>
                <h1 style={{ fontSize: 22, margin: 0, color: '#102a22', letterSpacing: '-0.02em' }}>FUNDSROOM DISTRIBUTION</h1>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#65756d' }}>Wholesale Operations & Supply Chain Portal</p>
                <div style={{ fontSize: 12, marginTop: 4, color: '#65756d' }}>MIDC Industrial Area, Pune, Maharashtra, India</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={'pill ' + viewChallan.status.toLowerCase()} style={{ fontSize: 12, padding: '6px 14px' }}>
                  ● {viewChallan.status}
                </span>
                <h3 style={{ margin: '8px 0 0', fontSize: 16, fontFamily: 'monospace' }}>{viewChallan.challan_number}</h3>
                <div style={{ fontSize: 12, color: '#65756d' }}>Challan Date: {new Date(viewChallan.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="detail-grid" style={{ marginBottom: 20 }}>
              <div><strong>Consignee / Customer:</strong> <span>{viewChallan.customer_name}</span></div>
              <div><strong>Business Name:</strong> <span>{viewChallan.business_name || 'Individual Merchant'}</span></div>
              <div><strong>Contact Number:</strong> <span>{viewChallan.customer_mobile || '—'} {viewChallan.customer_email ? `· ${viewChallan.customer_email}` : ''}</span></div>
              <div><strong>GSTIN:</strong> <span style={{ fontFamily: 'monospace' }}>{viewChallan.gst_number || 'Unregistered'}</span></div>
              <div style={{ gridColumn: 'span 2' }}><strong>Delivery Destination:</strong> <span>{viewChallan.customer_address || '—'}</span></div>
            </div>

            <div className="table-wrap" style={{ marginBottom: 18 }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product & Specification Snapshot</th>
                    <th>SKU Code</th>
                    <th style={{ textAlign: 'right' }}>Unit Price (₹)</th>
                    <th style={{ textAlign: 'right' }}>Quantity</th>
                    <th style={{ textAlign: 'right' }}>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {viewChallan.items?.map((item, idx) => {
                    const lineTotal = Number(item.unit_price || 0) * item.quantity;
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td><strong>{item.product_name}</strong></td>
                        <td><code style={{ fontSize: 11, fontFamily: 'monospace' }}>{item.sku}</code></td>
                        <td style={{ textAlign: 'right' }}>{Number(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td style={{ textAlign: 'right' }}><strong>{item.quantity}</strong></td>
                        <td style={{ textAlign: 'right' }}>₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#f8faf9', fontWeight: 800 }}>
                    <td colSpan={4} style={{ textAlign: 'right', padding: 12 }}>Total Quantity & Dispatched Value:</td>
                    <td style={{ textAlign: 'right', padding: 12 }}>{viewChallan.total_quantity} units</td>
                    <td style={{ textAlign: 'right', padding: 12, color: '#15803d' }}>
                      ₹{viewChallan.items?.reduce((acc, i) => acc + (Number(i.unit_price || 0) * i.quantity), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style={{ fontSize: 12, color: '#65756d', borderTop: '1px solid #edf0ee', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>Issued by: <strong>{viewChallan.created_by_name || 'Authorized Staff'}</strong></div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ borderBottom: '1px solid #65756d', width: 140, marginBottom: 4 }}></div>
                <div>Authorized Signatory</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            {viewChallan.status === 'Draft' && canCreate && (
              <button onClick={() => confirmDraft(viewChallan.id)} style={{ background: '#196f50' }}>
                <CheckCircle2 size={16} /> Confirm Challan & Reduce Stock
              </button>
            )}
            <button className="btn-secondary" onClick={() => window.print()}>
              <Printer size={16} /> Print / Export as PDF
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

/* ==================== APP ROOT ==================== */
function App() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.user || 'null');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.user = JSON.stringify(user);
    else localStorage.removeItem('user');
  }, [user]);

  return (
    <BrowserRouter>
      {user ? <Shell user={user} setUser={setUser} /> : <Routes><Route path="*" element={<Login setUser={setUser} />} /></Routes>}
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
