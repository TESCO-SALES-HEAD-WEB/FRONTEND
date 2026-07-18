import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Topbar.css';

export default function Topbar({ toggleSidebar }) {
  const location = useLocation();
  
  // Basic breadcrumb logic
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return 'Dashboard';
    
    return paths.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');
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
          {/* Mock date picker */}
          <span className="topbar__date-value">This Month</span>
        </div>

        <button className="topbar__icon-btn">
          <Bell size={20} />
          <span className="topbar__notification-dot"></span>
        </button>
        
        <div className="topbar__avatar">SH</div>
      </div>
    </header>
  );
}
