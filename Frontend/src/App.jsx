import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { ViewModeProvider } from './context/ViewModeContext';
import { getUser, clearSession } from './api/client';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Approvals from './pages/Approvals';
import Leads from './pages/Leads';
import Appointments from './pages/Appointments';
import Quotations from './pages/Quotations';
import Orders from './pages/Orders';
import Hierarchy from './pages/Hierarchy';
import Pipeline from './pages/Pipeline';
import Reports from './pages/Reports';
import AuditLog from './pages/AuditLog';
import Settings from './pages/Settings';
import NewHandoverForm from './pages/NewHandoverForm';
import Payments from './pages/Payments';
import TescoERM from './pages/TescoERM';

// This application is LOCKED to the Sales Head role.
const APP_ROLE = 'Sales Head';

// If opened from an older shared-portal link (?head/?email), capture the identity
// for display only. It no longer grants access — a real backend login is required.
(function bootstrapPortalSession() {
  try {
    const params = new URLSearchParams(window.location.search);
    const head = params.get('head');
    const email = params.get('email');
    if (head || email) {
      if (head) localStorage.setItem('sh_name', head);
      if (email) localStorage.setItem('sh_email', email);
      window.history.replaceState({}, '', window.location.pathname);
    }
  } catch (e) { /* ignore */ }
})();

// Guard every dashboard route:
//  1. must be authenticated (token + flag)
//  2. the signed-in account's role must be Sales Head.
// This blocks reaching the Head dashboard by editing the URL or by carrying a
// token/localStorage over from another role's app.
const ProtectedRoute = ({ children }) => {
  const authenticated =
    !!localStorage.getItem('crm_token') &&
    localStorage.getItem('crm_authenticated') === 'true';
  if (!authenticated) return <Navigate to="/login" replace />;

  const role = getUser()?.role;
  if (role && role !== APP_ROLE) {
    clearSession();
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ViewModeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/new" element={<NewHandoverForm />} />
            <Route path="/orders/edit/:id" element={<NewHandoverForm />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/approvals/:id" element={<Approvals />} />
            <Route path="/tesco-erm" element={<TescoERM />} />
            <Route path="/hierarchy" element={<Hierarchy />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<div className="p-4">Profile Placeholder</div>} />
          </Route>

          {/* Any unknown path falls through to the dashboard (which itself is guarded) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ViewModeProvider>
  );
}

export default App;
