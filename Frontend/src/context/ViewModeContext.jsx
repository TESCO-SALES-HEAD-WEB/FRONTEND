import React, { createContext, useContext, useState } from 'react';

// App-wide selections shared across every module:
//   view        -> 'manager' | 'coordinator'      (role perspective)
//   manager     -> 'all' | <manager name>         (which manager's data to show)
//   coordinator -> 'all' | <coordinator name>     (which coordinator to focus)
// Chosen once from any page and applied everywhere until changed. Persisted so
// selections survive navigation and reloads.
const ViewModeContext = createContext(null);

const VIEW_KEY = 'sh_view_mode';
const MGR_KEY = 'sh_manager';
const CO_KEY = 'sh_coordinator';

const readView = () => {
  try {
    const v = localStorage.getItem(VIEW_KEY);
    return v === 'coordinator' || v === 'manager' ? v : 'manager';
  } catch (e) {
    return 'manager';
  }
};

const readKey = (key) => {
  try {
    return localStorage.getItem(key) || 'all';
  } catch (e) {
    return 'all';
  }
};

export function ViewModeProvider({ children }) {
  const [view, setViewState] = useState(readView);
  const [manager, setManagerState] = useState(() => readKey(MGR_KEY));
  const [coordinator, setCoordinatorState] = useState(() => readKey(CO_KEY));

  const setView = (v) => {
    const next = v === 'coordinator' ? 'coordinator' : 'manager';
    setViewState(next);
    try { localStorage.setItem(VIEW_KEY, next); } catch (e) { /* ignore */ }
  };

  const setManager = (mg) => {
    const next = mg || 'all';
    setManagerState(next);
    try { localStorage.setItem(MGR_KEY, next); } catch (e) { /* ignore */ }
  };

  const setCoordinator = (co) => {
    const next = co || 'all';
    setCoordinatorState(next);
    try { localStorage.setItem(CO_KEY, next); } catch (e) { /* ignore */ }
  };

  return (
    <ViewModeContext.Provider value={{ view, setView, manager, setManager, coordinator, setCoordinator }}>
      {children}
    </ViewModeContext.Provider>
  );
}

// Returns { view, setView, manager, setManager, coordinator, setCoordinator }. Safe default outside the provider.
export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  return ctx || { view: 'manager', setView: () => {}, manager: 'all', setManager: () => {}, coordinator: 'all', setCoordinator: () => {} };
}
