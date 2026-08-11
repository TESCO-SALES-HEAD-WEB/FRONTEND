import React, { useEffect, useState } from 'react';
import { Download, Search, Filter, ChevronDown } from 'lucide-react';
import { api } from '../api/client';
import './AuditLog.css';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const leads = await api('/leads');
        const list = Array.isArray(leads) ? leads : [];
        const entries = [];
        list.forEach(lead => {
          const history = Array.isArray(lead && lead.history) ? lead.history : [];
          history.forEach((h, idx) => {
            entries.push({
              key: `${lead.id}-${idx}`,
              leadId: lead.id,
              name: lead.name,
              manager: lead.manager,
              timestamp: h.timestamp,
              message: h.message,
            });
          });
        });
        const parseable = entries.some(e => !Number.isNaN(Date.parse(e.timestamp)));
        if (parseable) {
          entries.sort((a, b) => {
            const ta = Date.parse(a.timestamp) || 0;
            const tb = Date.parse(b.timestamp) || 0;
            return tb - ta;
          });
        } else {
          // Timestamps unreliable to parse: best-effort most-recent-first.
          entries.reverse();
        }
        if (active) setLogs(entries);
      } catch (err) {
        if (active) setLogs([]);
      }
    })();
    return () => { active = false; };
  }, []);

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
        <div className="date-separator">Activity</div>
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
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>
                  No activity to display yet.
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.key}>
                  <td className="mono text-muted">{log.timestamp}</td>
                  <td>
                    <div className="font-medium">{log.manager || 'System'}</div>
                    <div className="text-xs text-muted">{log.name}</div>
                  </td>
                  <td>
                    <span className="action-chip">{log.message}</span>
                  </td>
                  <td><a href="#" className="font-medium">{log.leadId}</a></td>
                  <td className="mono text-xs">-</td>
                  <td><button className="btn btn--icon"><ChevronDown size={16}/></button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
