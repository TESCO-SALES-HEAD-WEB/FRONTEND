import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { api } from '../api/client';
import { useViewMode } from '../context/ViewModeContext';

// Single source of truth for the Sales Head's role-scope filter dropdown.
//
// Manager View   -> lists real Sales Managers (from /auth/managers) and binds to `manager`.
// Coordinator View -> lists real Sales Coordinators (role === 'Sales Coordinator', from the
//   shared users collection) and binds to `coordinator`. It NEVER shows a manager here.
//   • While only ONE active coordinator exists, the dropdown is hidden entirely and that
//     coordinator is used automatically (no selection required).
//   • As soon as TWO OR MORE active coordinators exist, the dropdown appears, populated
//     dynamically from the database — no hardcoded names.
export default function ScopeFilter() {
  const { view: viewMode, manager, setManager, coordinator, setCoordinator } = useViewMode();
  const [managers, setManagers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const mgrs = await api('/auth/managers');
        const names = (Array.isArray(mgrs) ? mgrs : [])
          .map((m) => (typeof m === 'string' ? m : (m && (m.name || m.manager)) || ''))
          .filter(Boolean);
        if (active) setManagers(names);
      } catch { if (active) setManagers([]); }
      try {
        const cos = await api('/users?role=Sales Coordinator');
        const names = (Array.isArray(cos) ? cos : [])
          .filter((u) => u && u.isActive !== false)
          .map((u) => (typeof u === 'string' ? u : (u && u.name) || ''))
          .filter(Boolean);
        if (active) setCoordinators(names);
      } catch { if (active) setCoordinators([]); }
    })();
    return () => { active = false; };
  }, []);

  // If the selected coordinator is no longer valid (e.g. list loaded), keep 'all'.
  const isManager = viewMode === 'manager';

  // Coordinator View with a single (or zero) coordinator → no dropdown; use it automatically.
  if (!isManager && coordinators.length <= 1) return null;

  const value = isManager ? manager : coordinator;
  const onChange = isManager ? setManager : setCoordinator;
  const allLabel = isManager ? 'All Managers' : 'All Coordinators';
  const options = isManager ? managers : coordinators;

  return (
    <div className="custom-select-wrapper">
      <select
        className="btn btn--secondary filter-dropdown filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">{allLabel}</option>
        {options.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <ChevronDown size={14} className="text-muted select-icon" />
    </div>
  );
}
