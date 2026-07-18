import React, { useState } from 'react';
import { Network, List, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import './Hierarchy.css';

export default function Hierarchy() {
  const [viewMode, setViewMode] = useState('chart');

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
                    <div className="node-name">Sarah Head</div>
                    <div className="node-role">Sales Head</div>
                  </div>
                </div>
              </div>
              
              <div className="connector-vertical"></div>
              <div className="connector-horizontal"></div>

              {/* Manager Tier */}
              <div className="node-tier manager-tier">
                <div className="branch">
                  <div className="connector-vertical"></div>
                  <div className="org-node manager-node">
                    <div className="node-avatar">PS</div>
                    <div className="node-info">
                      <div className="node-name">Priya Sharma</div>
                      <div className="node-role">Manager • North</div>
                      <div className="node-stats">Team: 4 • Target: 95%</div>
                    </div>
                  </div>
                  <div className="connector-vertical"></div>
                  <div className="node-tier coordinator-tier">
                    <div className="org-node coordinator-node">
                      <div className="node-avatar">RK</div>
                      <div className="node-info">
                        <div className="node-name">Rahul K.</div>
                        <div className="node-role">Coordinator</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="branch">
                  <div className="connector-vertical"></div>
                  <div className="org-node manager-node">
                    <div className="node-avatar">AP</div>
                    <div className="node-info">
                      <div className="node-name">Amit Patel</div>
                      <div className="node-role">Manager • West</div>
                      <div className="node-stats">Team: 2 • Target: 105%</div>
                    </div>
                  </div>
                </div>
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
            <p className="text-muted">List view placeholder. Displays flat hierarchy table.</p>
          </div>
        )}
      </div>

      <div className="unassigned-tray">
        <h3 className="tray-title">Unassigned Coordinators (3)</h3>
        <p className="text-xs text-muted mb-2">Drag a coordinator onto a manager card to reassign.</p>
        <div className="tray-items">
          <div className="tray-card">Sneha G.</div>
          <div className="tray-card">Raj P.</div>
          <div className="tray-card">Anita M.</div>
        </div>
      </div>
    </div>
  );
}
