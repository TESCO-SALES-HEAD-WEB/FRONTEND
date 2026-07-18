import React from 'react';
import { Download, Search, Filter, ChevronDown } from 'lucide-react';
import './AuditLog.css';

const mockLogs = [
  { id: 1, time: '10:42 AM', actor: 'Sarah Head', role: 'Sales Head', action: 'APPROVED', entity: 'REQ-2042', ip: '192.168.1.45' },
  { id: 2, time: '09:15 AM', actor: 'Priya Sharma', role: 'Sales Manager', action: 'CREATED', entity: 'REQ-2043', ip: '10.0.0.12' },
  { id: 3, time: '08:30 AM', actor: 'System', role: 'Automated', action: 'UPDATED', entity: 'Target sync', ip: 'internal' },
];

export default function AuditLog() {
  return (
    <div className="audit-container">
      <div className="page-header">
        <h1>Audit Log</h1>
        <button className="btn btn--secondary"><Download size={16}/> Export CSV</button>
      </div>

      <div className="users-toolbar bg-surface p-4 border radius-sm mb-4">
        <div className="search-box">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search actor, entity, IP..." />
        </div>
        <div className="toolbar-actions">
          <button className="btn btn--secondary"><Filter size={16} /> Actor</button>
          <button className="btn btn--secondary"><Filter size={16} /> Action</button>
          <button className="btn btn--secondary"><Filter size={16} /> Date</button>
        </div>
      </div>

      <div className="table-container">
        <div className="date-separator">Today</div>
        <table className="data-table audit-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity</th>
              <th>IP Address</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {mockLogs.map(log => (
              <tr key={log.id}>
                <td className="mono text-muted">{log.time}</td>
                <td>
                  <div className="font-medium">{log.actor}</div>
                  <div className="text-xs text-muted">{log.role}</div>
                </td>
                <td>
                  <span className={`action-chip ${log.action.toLowerCase()}`}>{log.action}</span>
                </td>
                <td><a href="#" className="font-medium">{log.entity}</a></td>
                <td className="mono text-xs">{log.ip}</td>
                <td><button className="btn btn--icon"><ChevronDown size={16}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
