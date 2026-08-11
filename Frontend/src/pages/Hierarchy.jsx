import React, { useState, useEffect } from 'react';
import { Network, List, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { api } from '../api/client';
import './Hierarchy.css';

function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts.map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Hierarchy() {
  const [viewMode, setViewMode] = useState('chart');
  const [managers, setManagers] = useState([]);
  const [leadCounts, setLeadCounts] = useState({});

  useEffect(() => {
    let active = true;
    (async () => {
      const [mgrs, leads] = await Promise.all([
        api('/auth/managers').catch(() => []),
        api('/leads').catch(() => []),
      ]);
      if (!active) return;
      const counts = {};
      (Array.isArray(leads) ? leads : []).forEach((l) => {
        if (l && l.manager) counts[l.manager] = (counts[l.manager] || 0) + 1;
      });
      setManagers(Array.isArray(mgrs) ? mgrs : []);
      setLeadCounts(counts);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="hierarchy-container">
      <div className="page-header">
        <h1>Team Hierarchy</h1>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'chart' ? 'active' : ''}`}
            onClick={() => setViewMode('chart')}
          >
            <Network size={16} /> Chart
          </button>
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List size={16} /> List
          </button>
        </div>
      </div>

      <div className="hierarchy-content">
        {viewMode === 'chart' ? (
          <div className="org-chart-wrapper">
            <div className="org-chart">
              {/* Head Node */}
              <div className="node-tier">
                <div className="org-node head-node">
                  <div className="node-avatar bg-primary">SH</div>
                  <div className="node-info">
                    <div className="node-name">Sales Head</div>
                    <div className="node-role">Sales Head</div>
                  </div>
                </div>
              </div>

              <div className="connector-vertical"></div>
              <div className="connector-horizontal"></div>

              {/* Manager Tier */}
              <div className="node-tier manager-tier">
                {managers.length === 0 ? (
                  <div className="branch">
                    <div className="connector-vertical"></div>
                    <div className="org-node manager-node">
                      <div className="node-info">
                        <div className="node-name text-muted">No managers found</div>
                        <div className="node-role">Sales Manager</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  managers.map((m) => (
                    <div className="branch" key={m.employeeId || m.email || m.name}>
                      <div className="connector-vertical"></div>
                      <div className="org-node manager-node">
                        <div className="node-avatar">{initials(m.name)}</div>
                        <div className="node-info">
                          <div className="node-name">{m.name}</div>
                          <div className="node-role">Sales Manager</div>
                          <div className="node-stats">Leads: {leadCounts[m.name] || 0}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="chart-controls">
              <button className="btn--icon"><ZoomIn size={18} /></button>
              <button className="btn--icon"><ZoomOut size={18} /></button>
              <button className="btn--icon"><Maximize size={18} /></button>
            </div>
          </div>
        ) : (
          <div className="hierarchy-list bg-surface radius-sm p-4 border">
            {managers.length === 0 ? (
              <p className="text-muted">No managers found.</p>
            ) : (
              managers.map((m) => (
                <div className="tray-card" key={m.employeeId || m.email || m.name}>
                  {m.name} — {leadCounts[m.name] || 0} leads
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
