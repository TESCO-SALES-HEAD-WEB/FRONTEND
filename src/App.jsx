import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Approvals from './pages/Approvals';
import UserManagement from './pages/UserManagement';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/new" element={<NewHandoverForm />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/approvals/:id" element={<Approvals />} />
          <Route path="/tesco-erm" element={<TescoERM />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/users/new" element={<UserManagement />} />
          <Route path="/users/:id" element={<div className="p-4">User Detail</div>} />
          <Route path="/hierarchy" element={<Hierarchy />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<div className="p-4">Profile Placeholder</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
