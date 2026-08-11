import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { ViewModeProvider } from './context/ViewModeContext';

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

// If opened from the shared login portal (with ?head/?email params), capture the
// Sales Head identity for display. Runs at import time, before routing evaluates.
(function bootstrapPortalSession() {
  try {
    const params = new URLSearchParams(window.location.search);
    const head = params.get('head');
    const email = params.get('email');
    if (head || email) {
      if (head) localStorage.setItem('sh_name', head);
      if (email) localStorage.setItem('sh_email', email);
      localStorage.setItem('crm_user', JSON.stringify({ name: head || 'Sales Head', email: email || '', role: 'Sales Head' }));
      window.history.replaceState({}, '', window.location.pathname);
    }
  } catch (e) { /* ignore */ }
})();

function App() {
  return (
    <ViewModeProvider>
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
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

        {/* Any unknown path (including the old /login) falls through to the dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
    </ViewModeProvider>
  );
}

export default App;
