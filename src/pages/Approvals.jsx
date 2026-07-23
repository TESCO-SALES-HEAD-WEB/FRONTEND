import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApprovals } from '../mocks/approvals';
import { 
  Filter, Download, Search, AlertTriangle, Paperclip, 
  ArrowRight, X 
} from 'lucide-react';
import './Approvals.css';

export default function Approvals() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('manager');
  const [selectedIds, setSelectedIds] = useState([]);
  const [approvalsData, setApprovalsData] = useState(mockApprovals);
  
  const filteredApprovals = approvalsData.filter(req => {
    if (activeTab === 'All') return true;
    if (activeTab === 'History') return req.status !== 'pending';
    return req.status.toLowerCase() === activeTab.toLowerCase();
  });

  const pendingCount = approvalsData.filter(req => req.status === 'pending').length;

  const selectedRequest = id ? approvalsData.find(a => a.id === id) : null;

  const handleRowClick = (reqId) => {
    navigate(`/approvals/${reqId}`);
  };

  const closeDrawer = () => {
    navigate('/approvals');
  };

  const handleAction = (newStatus) => {
    if (!selectedRequest) return;
    setApprovalsData(prev => prev.map(req => 
      req.id === selectedRequest.id ? { ...req, status: newStatus } : req
    ));
    closeDrawer();
  };

  const toggleSelect = (e, reqId) => {
    e.stopPropagation();
    if (selectedIds.includes(reqId)) {
      setSelectedIds(selectedIds.filter(i => i !== reqId));
    } else {
      setSelectedIds([...selectedIds, reqId]);
    }
  };

  const getTypeIconColor = (type) => {
    switch(type) {
      case 'Discount': return 'var(--danger)';
      case 'Target change': return 'var(--warning)';
      case 'Quotation': return 'var(--primary)';
      case 'Design': return '#8b5cf6'; // Purple for design
      default: return 'var(--info)';
    }
  };

  return (
    <div className="approvals-container">
      <div className="dashboard-header-bar" style={{ marginBottom: '1rem' }}>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'manager' ? 'active' : ''}`}
            onClick={() => setViewMode('manager')}
          >
            Manager View
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'coordinator' ? 'active' : ''}`}
            onClick={() => setViewMode('coordinator')}
          >
            Coordinator View
          </button>
        </div>
      </div>

      <div className="approvals-header">
        <div className="approvals-tabs">
          {['All', 'Pending', 'Approved', 'Rejected', 'History'].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} {tab === 'Pending' && <span className="tab-badge">{pendingCount}</span>}
            </button>
          ))}
        </div>
        <div className="approvals-actions">
          <div className="search-box approvals-search">
            <Search size={16} className="text-muted" />
            <input type="text" placeholder="Search requests..." />
          </div>
          <button 
            className="btn btn--secondary" 
            disabled={selectedIds.length === 0}
          >
            Bulk approve
          </button>
          <button className="btn btn--icon">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(filteredApprovals.map(r => r.id));
                    else setSelectedIds([]);
                  }}
                  checked={selectedIds.length === filteredApprovals.length && filteredApprovals.length > 0}
                />
              </th>
              <th>REQUEST DETAILS</th>
              <th>AMOUNT</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredApprovals.map(req => (
              <tr 
                key={req.id} 
                onClick={() => handleRowClick(req.id)}
                className={`clickable-row ${selectedRequest?.id === req.id ? 'selected-row' : ''}`}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(req.id)}
                    onChange={(e) => toggleSelect(e, req.id)}
                  />
                </td>
                <td>
                  <div className="req-cell">
                    <div className="req-title-wrapper">
                      <div className="type-dot" style={{ backgroundColor: getTypeIconColor(req.type) }}></div>
                      <span className="font-medium">{req.title}</span>
                    </div>
                    <div className="req-meta text-xs text-muted">
                      <span className="mono">{req.id}</span> • 
                      <span className="inline-avatar">
                        <span className="avatar-xs">{req.requester.avatar}</span> {req.requester.name}
                      </span> • {req.age}
                    </div>
                  </div>
                </td>
                <td className="font-medium">{req.amount}</td>
                <td>
                  <span className={`priority-chip ${req.priority}`}>{req.priority}</span>
                </td>
                <td>
                  <span className={`status-badge status-${req.status.toLowerCase()}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="drawer-overlay" onClick={closeDrawer}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="detail-content">
              <div className="detail-header">
                <div>
                  <div className="detail-id">{selectedRequest.id}</div>
                  <h2 className="detail-title">{selectedRequest.title}</h2>
                </div>
                <div className="drawer-close">
                  <button className="btn--icon" onClick={closeDrawer}><X size={20}/></button>
                </div>
              </div>

              {selectedRequest.impact.warning && (
                <div className="warning-banner">
                  <AlertTriangle size={16} />
                  <span>{selectedRequest.impact.warning}</span>
                </div>
              )}

              <div className="summary-grid">
                <div className="summary-item">
                  <label>Requested by</label>
                  <div className="requester-info">
                    <div className="avatar-sm">{selectedRequest.requester.avatar}</div>
                    <div>
                      <div className="font-medium">{selectedRequest.requester.name}</div>
                      <div className="text-muted text-xs">{selectedRequest.requester.role} • {selectedRequest.requester.team}</div>
                    </div>
                  </div>
                </div>
                
                <div className="summary-item">
                  <label>Date raised</label>
                  <div>{selectedRequest.dateRaised}</div>
                </div>

                <div className="summary-item full-width">
                  <label>Change requested</label>
                  <div className="change-value">
                    <span className="strike">{selectedRequest.currentValue}</span>
                    <ArrowRight size={16} className="text-muted" />
                    <span className="highlight">{selectedRequest.requestedValue}</span>
                  </div>
                  {selectedRequest.impact.margin !== 'N/A' && (
                    <div className="impact-text text-danger">
                      Margin drops: {selectedRequest.impact.margin}
                    </div>
                  )}
                </div>

                <div className="summary-item full-width">
                  <label>Reason</label>
                  <div className="quote-block">"{selectedRequest.reason}"</div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Attachments</h3>
                <div className="attachments-list">
                  <div className="attachment-chip">
                    <Paperclip size={14} />
                    <span>competitor_quote.pdf (2.4MB)</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Approval chain</h3>
                <div className="approval-stepper">
                  {selectedRequest.chain.map((node, idx) => (
                    <div key={idx} className="step-node">
                      <div className="step-avatar">{node.name.charAt(0)}</div>
                      <div className="step-content">
                        <div className="step-header">
                          <span className="font-medium">{node.name}</span>
                          <span className="text-muted text-xs">{node.role} • {node.timestamp}</span>
                        </div>
                        <div className="step-comment">{node.comment}</div>
                      </div>
                    </div>
                  ))}
                  <div className="step-node pending">
                    <div className="step-avatar pending">SH</div>
                    <div className="step-content">
                      <div className="font-medium">You</div>
                      <div className="text-muted text-xs">Pending approval</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="drawer-footer">
              <button className="btn ghost-danger" onClick={() => handleAction('rejected')}>Reject</button>
              <button className="btn btn--secondary" onClick={() => handleAction('changes_requested')}>Request changes</button>
              <button className="btn btn--primary" onClick={() => handleAction('approved')}>Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
