import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, clearSession } from '../api/client';
import './Topbar.css';

const READ_KEY = 'sh_notif_read';
const loadReadSet = () => { try { return new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]')); } catch { return new Set(); } };
const saveReadSet = (set) => localStorage.setItem(READ_KEY, JSON.stringify([...set]));

const timeAgo = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  if (isNaN(diff) || diff < 0) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function Topbar({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [readSet, setReadSet] = useState(loadReadSet);
  const panelRef = useRef(null);

  const handleSignOut = () => {
    clearSession();
    const portal = import.meta.env.VITE_PORTAL_LOGIN_URL || 'http://localhost:5173/login';
    window.location.href = `${portal}?loggedout=1`;
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return 'Dashboard';
    return paths.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');
  };

  // Build the Sales Head's notifications from the shared CRM database
  useEffect(() => {
    let active = true;
    const safe = (p) => p.then((d) => (Array.isArray(d) ? d : [])).catch(() => []);
    const build = async () => {
      const [quotes, appts, leads] = await Promise.all([
        safe(api('/quotations')), safe(api('/appointments')), safe(api('/leads')),
      ]);
      if (!active) return;
      const items = [];

      // Quotations prepared and awaiting the Sales Head's approval
      quotes.filter(q => String(q.quotationStatus || '').toLowerCase() === 'prepared' && String(q.approvalStatus || '').toLowerCase() !== 'approved' && String(q.approvalStatus || '').toLowerCase() !== 'rejected')
        .forEach(q => items.push({
          id: `appr-${q.id}`, text: `Quotation ${q.id} awaiting your approval`, sortDate: q.updatedAt || q.createdAt, to: `/approvals/${q.id}`,
        }));

      // Appointments rescheduled by a manager/coordinator
      appts.filter(a => a.rescheduledAt).forEach(a => items.push({
        id: `resched-${a._id || a.id}-${a.rescheduledAt}`,
        text: `Rescheduled by ${a.rescheduledBy || 'a manager'}: ${a.title || 'Appointment'} → ${a.date || ''}`,
        sortDate: a.rescheduledAt, to: '/appointments',
      }));

      // Newly-received leads
      leads.filter(l => /new|received/i.test(l.status || '')).slice(0, 10).forEach(l => items.push({
        id: `lead-${l.id}`, text: `New lead: ${l.name || l.id}`, sortDate: l.updatedAt || l.createdAt || l.date, to: '/leads',
      }));

      items.sort((a, b) => new Date(b.sortDate || 0) - new Date(a.sortDate || 0));
      setNotifs(items.slice(0, 25));
    };
    build();
    return () => { active = false; };
  }, [location.pathname]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const unreadCount = notifs.filter(n => !readSet.has(n.id)).length;

  const markAllRead = () => {
    const set = new Set(readSet);
    notifs.forEach(n => set.add(n.id));
    saveReadSet(set);
    setReadSet(set);
  };

  const handleItemClick = (n) => {
    const set = new Set(readSet); set.add(n.id); saveReadSet(set); setReadSet(set);
    setOpen(false);
    if (n.to) navigate(n.to);
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__menu-btn" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="topbar__breadcrumb">
          {getBreadcrumbs()}
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar__date-picker">
          <span className="topbar__date-value">This Month</span>
        </div>

        <div ref={panelRef} style={{ position: 'relative' }}>
          <button className="topbar__icon-btn" onClick={() => setOpen(o => !o)} title="Notifications">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                className="topbar__notification-dot"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 16, height: 16, padding: '0 4px', borderRadius: 9999, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, lineHeight: 1 }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div
              style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', width: 340, maxHeight: 420, overflowY: 'auto', background: '#fff', border: '1px solid #E5E9F0', borderRadius: 12, boxShadow: '0 12px 32px rgba(15,23,42,0.16)', zIndex: 1000 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', borderBottom: '1px solid #EEF1F5', position: 'sticky', top: 0, background: '#fff' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Notifications</span>
                {notifs.length > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Mark all read</button>
                )}
              </div>
              {notifs.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>You're all caught up.</div>
              ) : (
                notifs.map(n => {
                  const unread = !readSet.has(n.id);
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleItemClick(n)}
                      style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '0.75rem 1rem', borderBottom: '1px solid #F4F6FA', cursor: 'pointer', background: unread ? '#F5F8FF' : '#fff' }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: unread ? '#4f46e5' : 'transparent' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', color: '#1F2937', fontWeight: unread ? 600 : 500 }}>{n.text}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 2 }}>{timeAgo(n.sortDate)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="topbar__avatar" onClick={handleSignOut} title="Sign out" style={{ cursor: 'pointer' }}>SK</div>
      </div>
    </header>
  );
}
