import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Network, 
  KanbanSquare, 
  BarChart3, 
  History, 
  Settings,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  User,
  CalendarDays,
  FileText,
  FileCheck,
  CreditCard,
  Target
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Target, label: 'Lead Management', path: '/leads' },
  { icon: KanbanSquare, label: 'Sales Pipeline', path: '/pipeline' },
  { icon: CalendarDays, label: 'Appointments', path: '/appointments' },
  { icon: FileText, label: 'Quotations', path: '/quotations' },
  { icon: FileCheck, label: 'Order Confirm', path: '/orders' },
  { icon: CreditCard, label: 'Payment Collection', path: '/payments' },
  { icon: CheckSquare, label: 'Approvals', path: '/approvals', badge: 7 },
  { icon: Network, label: 'Tesco ERM', path: '/tesco-erm' },
  { icon: Users, label: 'User Management', path: '/users' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

export default function Sidebar({ isCollapsed, toggleCollapse }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo-container">
          <div className="sidebar__logo"></div>
          {!isCollapsed && <span className="sidebar__role-pill">Sales Head</span>}
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
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
                {item.badge && <span className="sidebar__nav-badge">{item.badge}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div 
          className="sidebar__user" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="sidebar__avatar">SH</div>
          {!isCollapsed && (
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">Sarah Head</span>
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
            <button className="sidebar__menu-item">
              <Moon size={16} /> Switch theme
            </button>
            <button className="sidebar__menu-item text-danger" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
