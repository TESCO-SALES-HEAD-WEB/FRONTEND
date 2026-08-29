import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  Users,
  Network,
  KanbanSquare,
  BarChart3,
  History,
  Settings,
  ChevronRight,
  LogOut,
  KeyRound,
  User,
  CalendarDays,
  FileText,
  FileCheck,
  CreditCard,
  Target,
  X
} from 'lucide-react';
import { api, clearSession } from '../api/client';
import './Sidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Target, label: 'Lead Management', path: '/leads' },
  { icon: KanbanSquare, label: 'Sales Pipeline', path: '/pipeline' },
  { icon: CalendarDays, label: 'Appointments', path: '/appointments' },
  { icon: FileText, label: 'Quotations', path: '/quotations' },
  { icon: FileCheck, label: 'Order Confirm', path: '/orders' },
  { icon: CreditCard, label: 'Payment Collection', path: '/payments' },
  { icon: CheckSquare, label: 'Approvals', path: '/approvals' },
  { icon: Network, label: 'Tesco ERM', path: '/tesco-erm' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

const headEmail = () => {
  try {
    const u = JSON.parse(localStorage.getItem('crm_user') || '{}');
    return u.email || localStorage.getItem('sh_email') || 'salestescostructures@gmail.com';
  } catch (e) {
    return localStorage.getItem('sh_email') || 'salestescostructures@gmail.com';
  }
};

export default function Sidebar({ isCollapsed, toggleCollapse }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState(0);

  // Change-password modal
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState(null); // { type, text }
  const [pwBusy, setPwBusy] = useState(false);

  // Live count of quotations awaiting the Sales Head's approval
  useEffect(() => {
    let active = true;
    const loadCount = () => {
      api('/quotations')
        .then((qs) => {
          if (!active) return;
          // Only PREPARED quotations awaiting approval count toward the badge
          const n = (Array.isArray(qs) ? qs : []).filter((q) =>
            String(q.quotationStatus || '').toLowerCase() === 'prepared' &&
            String(q.approvalStatus || 'pending').toLowerCase() === 'pending'
          ).length;
          setPendingApprovals(n);
        })
        .catch(() => { if (active) setPendingApprovals(0); });
    };
    loadCount();
    const onFocus = () => loadCount();
    window.addEventListener('focus', onFocus);
    const t = setInterval(loadCount, 30000); // keep the badge fresh
    return () => { active = false; window.removeEventListener('focus', onFocus); clearInterval(t); };
  }, []);

  const handleLogout = () => {
    // Log out to this app's OWN Sales Head login.
    clearSession();
    window.location.href = '/login?loggedout=1';
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (!pw.current || !pw.next) return setPwMsg({ type: 'error', text: 'Please fill in all fields' });
    if (pw.next.length < 8) return setPwMsg({ type: 'error', text: 'New password must be at least 8 characters' });
    if (pw.next !== pw.confirm) return setPwMsg({ type: 'error', text: 'New passwords do not match' });
    setPwBusy(true);
    try {
      await api('/auth/change-password', { method: 'POST', body: { email: headEmail(), currentPassword: pw.current, newPassword: pw.next } });
      setPwMsg({ type: 'success', text: 'Password changed successfully. Use it next time you log in.' });
      setPw({ current: '', next: '', confirm: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message || 'Could not change password' });
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar__header">
        {isCollapsed ? (
          <h1 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--sidebar-text)', letterSpacing: '-0.01em' }}>SC</h1>
        ) : (
          <div className="sidebar__brand">
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--sidebar-text)', letterSpacing: '-0.01em', lineHeight: 1.15 }}>SalesCRM</h1>
            <span style={{ display: 'block', marginTop: '3px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--sidebar-text-muted)', letterSpacing: '0.05em' }}>Tesco Structures</span>
          </div>
        )}
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const badge = item.path === '/approvals' && pendingApprovals > 0 ? pendingApprovals : undefined;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar__nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="sidebar__nav-icon" size={20} />
              {!isCollapsed && (
                <>
                  <span className="sidebar__nav-label">{item.label}</span>
                  {badge && <span className="sidebar__nav-badge">{badge}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <div
          className="sidebar__user"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="sidebar__avatar">SK</div>
          {!isCollapsed && (
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">Saleem Khan</span>
              <span className="sidebar__user-role">Sales Head</span>
            </div>
          )}
          {!isCollapsed && <ChevronRight className={`sidebar__user-chevron ${menuOpen ? 'open' : ''}`} size={16} />}
        </div>

        {menuOpen && !isCollapsed && (
          <div className="sidebar__user-menu">
            <Link to="/profile" className="sidebar__menu-item">
              <User size={16} /> Profile
            </Link>
            <button className="sidebar__menu-item" onClick={() => { setMenuOpen(false); setPwMsg(null); setPwOpen(true); }}>
              <KeyRound size={16} /> Change password
            </button>
            <button className="sidebar__menu-item text-danger" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Change password modal */}
      {pwOpen && (
        <div
          onClick={() => setPwOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', width: '100%', maxWidth: '420px', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={18} /> Change Password
              </h3>
              <button onClick={() => setPwOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
            </div>

            {pwMsg && (
              <div style={{ padding: '0.6rem 0.9rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.85rem', background: pwMsg.type === 'error' ? '#FEE2E2' : '#DCFCE7', color: pwMsg.type === 'error' ? '#991B1B' : '#166534' }}>
                {pwMsg.text}
              </div>
            )}

            <form onSubmit={submitPassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>Current Password</label>
                <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} placeholder="Current password" style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E5E9F0', borderRadius: 8, outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>New Password</label>
                <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} placeholder="Min 8 characters" style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E5E9F0', borderRadius: 8, outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>Confirm New Password</label>
                <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} placeholder="Re-enter new password" style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E5E9F0', borderRadius: 8, outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setPwOpen(false)} style={{ padding: '0.6rem 1.1rem', borderRadius: 8, border: '1px solid #E5E9F0', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button type="submit" disabled={pwBusy} style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: 'none', background: '#4F46E5', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{pwBusy ? 'Saving…' : 'Update Password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
