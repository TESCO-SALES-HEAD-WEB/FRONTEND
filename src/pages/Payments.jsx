import React from 'react';
import { 
  Plus, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  CalendarDays,
  Eye,
  Edit2,
  CreditCard,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import DateRangePicker from '../components/DateRangePicker';
import RecordPaymentModal from '../components/RecordPaymentModal';
import './Payments.css';

const mockPayments = [
  {
    id: 'INV-1024',
    customer: 'Akash Kumar',
    orderValue: '₹4,25,000',
    amountCollect: '₹4,25,000',
    upcoming: '₹0',
    pending: '₹0',
    overdue: '₹0',
    dueDate: '15/06/2026',
    method: 'Bank Transfer'
  },
  {
    id: 'INV-1025',
    customer: 'Sarah Jenkins',
    orderValue: '₹2,40,000',
    amountCollect: '₹0',
    upcoming: '₹2,40,000',
    pending: '₹0',
    overdue: '₹0',
    dueDate: '30/07/2026',
    method: '-'
  },
  {
    id: 'INV-1026',
    customer: 'Ramesh Patel',
    orderValue: '₹13,50,000',
    amountCollect: '₹5,00,000',
    upcoming: '₹0',
    pending: '₹8,50,000',
    overdue: '₹0',
    dueDate: '10/07/2026',
    method: 'Cheque'
  },
  {
    id: 'INV-1027',
    customer: 'Emma Watson',
    orderValue: '₹32,500',
    amountCollect: '₹0',
    upcoming: '₹0',
    pending: '₹0',
    overdue: '₹32,500',
    dueDate: '01/07/2026',
    method: '-',
    isOverdue: true
  }
];

export default function Payments() {
  const [viewMode, setViewMode] = React.useState('manager');
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = React.useState(false);

  return (
    <div className="payments-page">
      <div className="breadcrumbs" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
        Pages / Payment Collection
      </div>
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

      <div className="payments-header">
        <h1>Payment Collection</h1>
        <button 
          className="btn btn--primary btn-icon" 
          style={{ background: '#1e1b4b', borderColor: '#1e1b4b' }}
          onClick={() => setIsRecordPaymentModalOpen(true)}
        >
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      <div className="payments-filters-top">
        <DateRangePicker />
        <div className="custom-select-wrapper">
          <select className="btn btn--secondary filter-dropdown filter-select">
            <option value="all">All Managers</option>
            <option value="john">John Doe</option>
            <option value="jane">Jane Smith</option>
          </select>
          <ChevronDown size={14} className="text-muted select-icon" />
        </div>
      </div>

      <div className="payments-metrics">
        <div className="payments-metric-card">
          <div className="metric-icon-box icon-green">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-val">₹2.4Cr</div>
            <div className="metric-lbl">Total Collected</div>
          </div>
        </div>
        
        <div className="payments-metric-card">
          <div className="metric-icon-box icon-blue">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-val">₹45L</div>
            <div className="metric-lbl">Upcoming Dues</div>
          </div>
        </div>

        <div className="payments-metric-card">
          <div className="metric-icon-box icon-orange">
            <AlertCircle size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-val">₹12L</div>
            <div className="metric-lbl">Pending Payments</div>
          </div>
        </div>

        <div className="payments-metric-card">
          <div className="metric-icon-box icon-red">
            <X size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-val">₹8.5L</div>
            <div className="metric-lbl">Overdue Payments</div>
          </div>
        </div>
      </div>

      <div className="payments-table-container">
        <div className="payments-table-filters" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {viewMode === 'manager' && (
            <div className="input-with-icon" style={{ width: '240px' }}>
              <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input type="text" className="form-input" placeholder="Search Invoice..." style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.875rem' }} />
            </div>
          )}
          <div className="custom-select-wrapper" style={{ width: '160px' }}>
            <select className="form-select" defaultValue="" style={{ height: '36px', fontSize: '0.875rem' }}>
              <option value="" disabled>Filter by Status</option>
              <option value="collected">Collected</option>
              <option value="pending">Pending</option>
            </select>
            <ChevronDown size={14} className="select-icon" />
          </div>
          <button className="btn btn--outline" style={{ height: '36px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            <CalendarDays size={14} />
            Date Range
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="payments-table">
            <thead>
              <tr>
                <th style={{ width: '8%' }}>LEAD ID</th>
                <th style={{ width: '10%' }}>CUSTOMER</th>
                <th style={{ width: '10%' }}>ORDER VALUE</th>
                <th style={{ width: '12%' }}>AMOUNT COLLECTED</th>
                <th style={{ width: '12%' }}>UPCOMING DUES</th>
                <th style={{ width: '12%' }}>PENDING PAYMENTS</th>
                <th style={{ width: '12%' }}>OVERDUE PAYMENTS</th>
                <th style={{ width: '12%' }}>DUE DATE</th>
                <th style={{ width: '10%' }}>METHOD</th>
                <th style={{ width: '10%' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {mockPayments.map((payment, i) => (
                <tr key={i}>
                  <td className="fw-600 text-file-id-blue">{payment.id}</td>
                  <td className="fw-700 text-primary">{payment.customer}</td>
                  <td className="fw-700 text-primary">{payment.orderValue}</td>
                  <td className={payment.amountCollect !== '₹0' ? 'text-green' : 'text-primary'}>{payment.amountCollect}</td>
                  <td>{payment.upcoming}</td>
                  <td>{payment.pending}</td>
                  <td>{payment.overdue}</td>
                  <td>
                    <div className="input-with-icon" style={{ display: 'inline-flex', width: '110px' }}>
                      <input type="text" readOnly value={payment.dueDate} className="form-input" style={{ height: '28px', fontSize: '0.75rem', padding: '0 0.5rem', color: payment.isOverdue ? '#ef4444' : 'inherit', fontWeight: payment.isOverdue ? '600' : 'normal', background: 'transparent' }} />
                      <CalendarDays size={12} className="input-icon-right" />
                    </div>
                  </td>
                  <td>{payment.method}</td>
                  <td>
                    <div className="action-buttons-group">
                      <button className="action-btn-sm" title="View"><Eye size={14} /></button>
                      <button className="action-btn-sm" title="Edit"><Edit2 size={14} /></button>
                      <button className="action-btn-sm" title="Pay"><CreditCard size={14} /></button>
                      <button className="action-btn-sm" title="Download"><Download size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-footer">
          <div className="text-muted" style={{ fontSize: '0.875rem' }}>
            Showing 1 to 6 of 45 invoices
          </div>
          <div className="pagination-controls">
            <button className="page-btn"><ChevronLeft size={16} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      <RecordPaymentModal 
        isOpen={isRecordPaymentModalOpen}
        onClose={() => setIsRecordPaymentModalOpen(false)}
      />
    </div>
  );
}
