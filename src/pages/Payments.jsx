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
import EditInvoiceModal from '../components/EditInvoiceModal';
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
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState(null);
  const [paymentsData, setPaymentsData] = React.useState(mockPayments);

  const handlePayClick = (payment) => {
    setSelectedPayment(payment);
    setIsRecordPaymentModalOpen(true);
  };

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setIsEditModalOpen(true);
  };

  const handleOpenNewPayment = () => {
    setSelectedPayment(null);
    setIsRecordPaymentModalOpen(true);
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m}-${d}`;
  };

  const handleDateChange = (id, newDateStr) => {
    if (!newDateStr) return;
    const [y, m, d] = newDateStr.split('-');
    const formatted = `${d}/${m}/${y}`;
    setPaymentsData(prev => prev.map(p => p.id === id ? { ...p, dueDate: formatted } : p));
  };

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
          onClick={handleOpenNewPayment}
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
              <option value="overdue">Overdue</option>
            </select>
            <ChevronDown size={14} className="text-muted select-icon" style={{ right: '10px' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="payments-table">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>ORDER VALUE</th>
                <th style={{ width: '14%' }}>AMOUNT COLLECTED</th>
                <th style={{ width: '12%' }}>UPCOMING DUES</th>
                <th style={{ width: '12%' }}>PENDING PAYMENTS</th>
                <th style={{ width: '12%' }}>OVERDUE PAYMENTS</th>
                <th style={{ width: '14%' }}>DUE DATE</th>
                <th style={{ width: '12%' }}>METHOD</th>
                <th style={{ width: '12%' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paymentsData.map((payment, i) => (
                <tr key={payment.id || i}>
                  <td className="fw-700 text-primary">{payment.orderValue}</td>
                  <td className={payment.amountCollect !== '₹0' ? 'text-primary fw-700' : 'text-primary'}>{payment.amountCollect}</td>
                  <td>{payment.upcoming}</td>
                  <td>{payment.pending}</td>
                  <td>{payment.overdue}</td>
                  <td>
                    <label className="custom-date-picker">
                      <span className={payment.isOverdue ? 'text-red' : ''}>{payment.dueDate}</span>
                      <CalendarDays size={16} className="calendar-icon" />
                      <input 
                        type="date" 
                        className="hidden-date-input" 
                        value={formatDateForInput(payment.dueDate)}
                        onChange={(e) => handleDateChange(payment.id, e.target.value)}
                      />
                    </label>
                  </td>
                  <td>{payment.method}</td>
                  <td>
                    <div className="action-buttons-group">
                      <button className="action-btn-sm" title="View"><Eye size={14} /></button>
                      <button 
                        className={`action-btn-sm ${selectedPayment?.id === payment.id && isEditModalOpen ? 'active' : ''}`} 
                        title="Edit"
                        onClick={() => handleEditClick(payment)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className={`action-btn-sm ${selectedPayment?.id === payment.id && isRecordPaymentModalOpen ? 'active' : ''}`} 
                        title="Pay"
                        onClick={() => handlePayClick(payment)}
                      >
                        <CreditCard size={14} />
                      </button>
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
        onClose={() => {
          setIsRecordPaymentModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />
      <EditInvoiceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />
    </div>
  );
}
