import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  Send, 
  ThumbsUp,
  ChevronDown,
  Plus,
  Eye,
  Download,
  Upload,
  CheckCircle2
} from 'lucide-react';
import DateRangePicker from '../components/DateRangePicker';
import UploadQuotationModal from '../components/UploadQuotationModal';
import './Quotations.css';

const mockCoordinatorQuotations = [
  {
    id: 'LD-1001',
    customerName: 'Reference Client',
    customerSubtitle: 'PEB',
    approvalStatus: 'Pending',
    quotationStatus: 'In Preparation'
  }
];

const mockManagerQuotations = [
  {
    id: 'LD-2026-089',
    customerName: 'Sarah Jenkins',
    approvalStatus: 'APPROVED',
    hasUpload: true,
    action: 'Approved'
  },
  {
    id: 'LD-2026-090',
    customerName: 'Tom Hardy',
    approvalStatus: '',
    hasUpload: true,
    action: 'Request'
  },
  {
    id: 'LD-2026-085',
    customerName: 'Elena Rodriguez',
    approvalStatus: 'APPROVED',
    hasUpload: true,
    action: 'Approved'
  },
  {
    id: 'LD-2026-082',
    customerName: 'David Thompson',
    approvalStatus: 'IN PROGRESS',
    hasUpload: true,
    action: 'Requested'
  },
  {
    id: 'LD-2026-077',
    customerName: 'Bruce Wayne',
    approvalStatus: '',
    hasUpload: true,
    action: 'Request'
  }
];

export default function Quotations() {
  const [viewMode, setViewMode] = useState('manager');
  const [quotationStatusDropdownOpen, setQuotationStatusDropdownOpen] = useState(false);
  const [isUploadQuotationModalOpen, setIsUploadQuotationModalOpen] = useState(false);

  return (
    <div className="quotations-page">
      <div className="dashboard-header-bar">
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

      <div className="quotations-header">
        <div>
          <h1>Quotations</h1>
          {viewMode === 'manager' && <p className="header-subtitle text-muted" style={{marginTop: '0.25rem', fontSize: '0.875rem'}}>Generate, send, and track project estimates</p>}
        </div>
        {viewMode === 'coordinator' && (
          <button className="btn btn--primary btn-icon" onClick={() => setIsUploadQuotationModalOpen(true)}>
            <Plus size={18} />
            Upload Quotation
          </button>
        )}
      </div>

      <div className="quotations-filters">
        <DateRangePicker />
        <div className="custom-select-wrapper">
          <select className="btn btn--secondary filter-dropdown filter-select">
            {viewMode === 'manager' ? (
              <>
                <option value="all">All Managers</option>
                <option value="priya">Priya Sharma</option>
                <option value="amit">Amit Patel</option>
              </>
            ) : (
              <>
                <option value="all">All Coordinators</option>
                <option value="rahul">Rahul Kumar</option>
                <option value="sneha">Sneha Gupta</option>
              </>
            )}
          </select>
          <ChevronDown size={14} className="text-muted select-icon" />
        </div>
      </div>

      {viewMode === 'manager' ? (
        <div className="quotations-metrics quotations-metrics-3col">
          <div className="metric-card card-blue">
            <div className="metric-header">
              <span className="metric-title text-muted">Requested Quotations</span>
              <FileText size={18} className="metric-icon" />
            </div>
            <div className="metric-value">12</div>
            <div className="metric-subtitle text-muted">New requests this week</div>
          </div>
          <div className="metric-card card-orange">
            <div className="metric-header">
              <span className="metric-title text-muted">Pending Quotations</span>
              <Clock size={18} className="metric-icon" />
            </div>
            <div className="metric-value">3</div>
            <div className="metric-subtitle text-muted">Awaiting approval</div>
          </div>
          <div className="metric-card card-green">
            <div className="metric-header">
              <span className="metric-title text-muted">Approved Quotations</span>
              <CheckCircle2 size={18} className="metric-icon" />
            </div>
            <div className="metric-value">8</div>
            <div className="metric-subtitle text-muted">Signed this month</div>
          </div>
        </div>
      ) : (
        <div className="quotations-metrics">
          <div className="metric-card card-blue">
            <div className="metric-header">
              <span className="metric-title text-muted">Requested Quotations</span>
              <FileText size={18} className="metric-icon" />
            </div>
            <div className="metric-value">1</div>
            <div className="metric-subtitle text-muted">Draft & initial requests</div>
          </div>
          <div className="metric-card card-orange">
            <div className="metric-header">
              <span className="metric-title text-muted">Pending Quotations</span>
              <Clock size={18} className="metric-icon" />
            </div>
            <div className="metric-value">1</div>
            <div className="metric-subtitle text-muted">Awaiting client/mgr approval</div>
          </div>
          <div className="metric-card card-cyan">
            <div className="metric-header">
              <span className="metric-title text-muted">Completed Quotations</span>
              <Send size={18} className="metric-icon" />
            </div>
            <div className="metric-value">0</div>
            <div className="metric-subtitle text-muted">Prepared & sent to clients</div>
          </div>
          <div className="metric-card card-green">
            <div className="metric-header">
              <span className="metric-title text-muted">Approved Quotations</span>
              <ThumbsUp size={18} className="metric-icon" />
            </div>
            <div className="metric-value">0</div>
            <div className="metric-subtitle text-muted">Accepted quotations</div>
          </div>
        </div>
      )}

      <div className="quotations-table-container">
        {viewMode === 'manager' ? (
          <table className="quotations-table">
            <thead>
              <tr>
                <th>LEAD ID</th>
                <th>CUSTOMER NAME</th>
                <th>APPROVALS</th>
                <th>QUOTATION UPLOAD</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {mockManagerQuotations.map(quote => (
                <tr key={quote.id}>
                  <td className="fw-600">{quote.id}</td>
                  <td className="fw-600" style={{color: '#334155'}}>{quote.customerName}</td>
                  <td>
                    {quote.approvalStatus === 'APPROVED' && (
                      <span className="badge-status badge-approved-green">
                        <CheckCircle2 size={12} style={{marginRight: '0.25rem', display: 'inline', verticalAlign: 'middle'}}/>
                        APPROVED
                      </span>
                    )}
                    {quote.approvalStatus === 'IN PROGRESS' && (
                      <span className="badge-status badge-inprogress-yellow">
                        <Clock size={12} style={{marginRight: '0.25rem', display: 'inline', verticalAlign: 'middle'}}/>
                        IN PROGRESS
                      </span>
                    )}
                  </td>
                  <td>
                    {quote.hasUpload && (
                      <button className="btn btn-sm btn--purple-outline">
                        <Upload size={14} /> Upload PDF
                      </button>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      {quote.action === 'Approved' && <button className="btn-action-disabled">Approved</button>}
                      {quote.action === 'Request' && <button className="btn-action-solid">Request</button>}
                      {quote.action === 'Requested' && <button className="btn-action-outline">Requested</button>}
                      
                      <button className="action-btn" title="Download" style={{border: '1px solid #e2e8f0', marginLeft: '0.5rem', opacity: quote.action === 'Approved' ? '1' : '0.5'}}>
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="quotations-table">
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Customer Name</th>
                <th>Approval Status</th>
                <th>Quotations Status</th>
                <th>Upload Quotation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockCoordinatorQuotations.map(quote => (
                <tr key={quote.id}>
                  <td className="fw-600">{quote.id}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{quote.customerName}</span>
                      <span className="customer-subtitle text-muted">{quote.customerSubtitle}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge-status badge-pending">
                      {quote.approvalStatus}
                    </span>
                  </td>
                  <td>
                    <div className="status-select-wrapper badge-in-prep" onClick={() => setQuotationStatusDropdownOpen(!quotationStatusDropdownOpen)}>
                      <select className="status-select" defaultValue={quote.quotationStatus} style={{ pointerEvents: 'none' }}>
                        <option value={quote.quotationStatus}>{quote.quotationStatus}</option>
                      </select>
                      <ChevronDown size={14} className="status-chevron" />
                      
                      {quotationStatusDropdownOpen && (
                        <div className="dark-dropdown-menu">
                          <div className="dark-dropdown-item active">In Preparation</div>
                          <div className="dark-dropdown-item">Sent</div>
                          <div className="dark-dropdown-item">Approved</div>
                          <div className="dark-dropdown-item">Rejected</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <button className="btn btn--outline btn-sm">
                      <Upload size={14} /> Upload PDF
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="action-btn" title="Download">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UploadQuotationModal
        isOpen={isUploadQuotationModalOpen}
        onClose={() => setIsUploadQuotationModalOpen(false)}
      />
    </div>
  );
}
