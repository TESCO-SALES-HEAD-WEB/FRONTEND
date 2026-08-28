import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useViewMode } from '../context/ViewModeContext';
import {
  Filter, Download, Search, AlertTriangle, Paperclip,
  ArrowRight, X
} from 'lucide-react';
import RejectRemarkModal from '../components/RejectRemarkModal';
import { showToast } from '../utils/toast';
import './Approvals.css';

const parseMoney=(v)=>{if(v==null)return 0;let s=String(v).toLowerCase().replace(/[₹,\s]/g,'');let x=1;if(s.endsWith('cr')){x=1e7;s=s.slice(0,-2);}else if(s.endsWith('l')){x=1e5;s=s.slice(0,-1);}else if(s.endsWith('k')){x=1e3;s=s.slice(0,-1);}else if(s.endsWith('m')){x=1e6;s=s.slice(0,-1);}const n=parseFloat(s.replace(/[^0-9.]/g,''));return isNaN(n)?0:n*x;};
const fmtMoney=(n)=>{const v=Number(n)||0;if(v>=1e7)return '₹'+(v/1e7).toFixed(2).replace(/\.?0+$/,'')+'Cr';if(v>=1e5)return '₹'+(v/1e5).toFixed(2).replace(/\.?0+$/,'')+'L';if(v>=1e3)return '₹'+(v/1e3).toFixed(1).replace(/\.0$/,'')+'k';return '₹'+Math.round(v).toLocaleString('en-IN');};

const initials = (name) => String(name || '?')
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map(w => w[0].toUpperCase())
  .join('') || '?';

const normPriority = (p) => {
  const v = String(p || '').toLowerCase();
  if (v.includes('high')) return 'high';
  if (v.includes('low')) return 'low';
  return 'medium';
};

// Map a raw quotation (+ optional lead) into the shape the UI expects.
const mapQuotation = (q, leadsById) => {
  const lead = leadsById[q.leadId] || {};
  const requesterName = lead.manager || lead.name || lead.clientName || q.client || 'Unknown';
  // Map the persisted approvalStatus to the UI status so Rejected quotations actually show as
  // Rejected (and appear under the Rejected/History tabs) instead of falling back to Pending.
  const rawApproval = String(q.approvalStatus || '').toLowerCase();
  const status = rawApproval === 'approved' ? 'approved'
    : rawApproval === 'rejected' ? 'rejected'
    : rawApproval === 'changes requested' ? 'changes_requested'
    : 'pending';
  const projectLabel = q.project || 'Quotation';
  return {
    id: q.id,
    leadId: q.leadId,
    type: 'Quotation',
    title: `${projectLabel} quotation`,
    // the actual PDF the manager/coordinator uploaded (fileData is a base64 data URI when present)
    fileName: q.fileName || null,
    fileData: q.fileData || null,
    requester: {
      name: requesterName,
      role: lead.manager ? 'Sales Manager' : 'Sales Coordinator',
      team: lead.location || lead.company || '—',
      avatar: initials(requesterName),
    },
    amount: fmtMoney(parseMoney(q.amount)),
    currentValue: q.revision || 'Rev 0',
    requestedValue: q.quotationStatus || 'Approval',
    age: lead.date || '',
    isOverdue: false,
    priority: normPriority(lead.priority),
    status,
    dateRaised: lead.date || '',
    reason: `Quotation ${q.id} for ${q.client || 'client'}${q.project ? ' — ' + q.project : ''}. GST: ${q.gst || 'N/A'}. Awaiting Sales Head approval.`,
    impact: { margin: 'N/A', warning: null },
    chain: [
      {
        role: lead.manager ? 'Manager' : 'Coordinator',
        name: requesterName,
        timestamp: lead.date || '',
        comment: `Prepared quotation (${q.revision || 'Rev 0'}).`,
      },
    ],
  };
};

export default function Approvals() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
    const { view: viewMode, setView: setViewMode, manager, setManager } = useViewMode();
  const [selectedIds, setSelectedIds] = useState([]);
  const [approvalsData, setApprovalsData] = useState([]);
  const [leadManagerById, setLeadManagerById] = useState({});

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [quotations, leads] = await Promise.all([
          api('/quotations').catch(() => []),
          api('/leads').catch(() => []),
        ]);
        const leadsById = {};
        const mgrById = {};
        (Array.isArray(leads) ? leads : []).forEach(l => { if (l && l.id) { leadsById[l.id] = l; mgrById[l.id] = l.manager; } });
        // Only PREPARED quotations are sent to the Sales Head for approval
        const mapped = (Array.isArray(quotations) ? [...quotations].sort((a, b) => new Date(b.createdAt || b.updatedAt || b.date || 0) - new Date(a.createdAt || a.updatedAt || a.date || 0)) : [])
          .filter(q => String(q.quotationStatus || '').toLowerCase() === 'prepared')
          .map(q => mapQuotation(q, leadsById));
        if (!cancelled) { setApprovalsData(mapped); setLeadManagerById(mgrById); }
      } catch {
        if (!cancelled) setApprovalsData([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const matchesManager = (req) => manager === 'all' || leadManagerById[req.leadId] === manager;

  const managerApprovals = approvalsData.filter(matchesManager);

  const matchesSearch = (req) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [req.title, req.id, req.requester?.name, req.type]
      .some((v) => String(v || '').toLowerCase().includes(q));
  };

  const filteredApprovals = managerApprovals.filter(req => {
    if (!matchesSearch(req)) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'History') return req.status !== 'pending';
    return req.status.toLowerCase() === activeTab.toLowerCase();
  });

  const pendingCount = managerApprovals.filter(req => req.status === 'pending').length;

  const selectedRequest = id ? approvalsData.find(a => a.id === id) : null;

  const handleRowClick = (reqId) => {
    navigate(`/approvals/${reqId}`);
  };

  const closeDrawer = () => {
    navigate('/approvals');
  };

  const handleAction = async (newStatus, extra = {}) => {
    if (!selectedRequest) return;
    const id = selectedRequest.id;
    const leadId = selectedRequest.leadId;
    // Reflect immediately in the UI
    setApprovalsData(prev => prev.map(req =>
      req.id === id ? { ...req, status: newStatus } : req
    ));
    // Persist to the shared DB so the owning manager/coordinator is notified (their apps
    // derive a notification from the quotation's approvalStatus).
    const approvalStatus = newStatus === 'approved' ? 'Approved'
      : newStatus === 'rejected' ? 'Rejected'
      : newStatus === 'changes_requested' ? 'Changes Requested'
      : 'Pending';
    const body = { approvalStatus, reviewedAt: new Date().toISOString(), ...extra };
    // Requesting changes sends the quotation back to its owner to revise, so it must leave
    // the Sales Head approval queue (which only lists 'Prepared' quotations).
    if (newStatus === 'changes_requested') body.quotationStatus = 'In Preparation';
    try {
      await api(`/quotations/${id}`, { method: 'PUT', body });
      // Lead lifecycle enforcement:
      // - APPROVED: permanently locks any further quotation for this lead (the lead has
      //   left the quotation stage) and advances it to the Order Confirmation stage.
      // - REJECTED / CHANGES REQUESTED: the lead's stage is left unchanged, re-opening it.
      if (newStatus === 'approved' && leadId) {
        try {
          await api(`/leads/${leadId}`, { method: 'PUT', body: { status: 'Order Confirmed' } });
        } catch (e) { /* keep optimistic UI even if the lead sync fails */ }
        showToast('Quotation approved — lead moved to Order Confirmation.', 'success');
      } else if (newStatus === 'rejected') {
        showToast('Quotation rejected — the owner has been notified.', 'info');
      } else if (newStatus === 'changes_requested') {
        showToast('Changes requested — sent back to the owner to revise.', 'info');
      }
    } catch (e) { /* keep optimistic UI even if the sync fails */ }
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
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                      <span className="mono" title={req.id}>{req.leadId || req.id}</span> •
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
                  <div className="detail-id" title={selectedRequest.id}>{selectedRequest.leadId || selectedRequest.id}</div>
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
                  {selectedRequest.fileName ? (
                    <div className="attachment-chip">
                      <Paperclip size={14} />
                      <span>{selectedRequest.fileName}</span>
                      {selectedRequest.fileData ? (
                        <>
                          <button
                            type="button"
                            className="btn--icon"
                            title="Open"
                            style={{ marginLeft: 'auto' }}
                            onClick={() => {
                              const w = window.open('', '_blank');
                              if (w) { w.document.write(`<title>${selectedRequest.fileName}</title><iframe src="${selectedRequest.fileData}" style="border:0;width:100vw;height:100vh"></iframe>`); w.document.close(); }
                            }}
                          >
                            <Search size={14} />
                          </button>
                          <a
                            className="btn--icon"
                            title="Download"
                            href={selectedRequest.fileData}
                            download={selectedRequest.fileName}
                            style={{ display: 'inline-flex', alignItems: 'center' }}
                          >
                            <Download size={14} />
                          </a>
                        </>
                      ) : (
                        <span className="text-muted text-xs" style={{ marginLeft: 'auto' }}>preview unavailable</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted text-xs">No file was attached to this quotation.</div>
                  )}
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
              <button className="btn ghost-danger" onClick={() => setIsRejectModalOpen(true)}>Reject</button>
              <button className="btn btn--secondary" onClick={() => handleAction('changes_requested')}>Request changes</button>
              <button className="btn btn--primary" onClick={() => handleAction('approved')}>Approve</button>
            </div>
          </div>
        </div>
      )}

      <RejectRemarkModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        requestId={selectedRequest?.id}
        onConfirm={(remark) => {
          // Persist the rejection reason on the quotation so the owner sees it in their
          // Quotations section and in the rejection notification.
          handleAction('rejected', { rejectionReason: remark });
          setIsRejectModalOpen(false);
        }}
      />
    </div>
  );
}
