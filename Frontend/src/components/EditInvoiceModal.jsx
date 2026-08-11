import React from 'react';
import { X, FileEdit, User, IndianRupee, CalendarDays, ChevronDown } from 'lucide-react';
import './RecordPaymentModal.css'; // Reusing the same CSS for consistent modal styling

export default function EditInvoiceModal({ isOpen, onClose, payment, onSave = () => {}, mode = 'edit' }) {
  const ro = mode === 'view'; // read-only "View" mode: show complete details, no editing
  const [paymentMethod, setPaymentMethod] = React.useState('Bank Transfer');
  const [customer, setCustomer] = React.useState('');
  const [orderValue, setOrderValue] = React.useState('');
  const [amountCollected, setAmountCollected] = React.useState('');
  const [pendingPayments, setPendingPayments] = React.useState('');
  const [upcomingDues, setUpcomingDues] = React.useState('');
  const [overduePayments, setOverduePayments] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [status, setStatus] = React.useState('');

  React.useEffect(() => {
    if (!isOpen) return;
    setPaymentMethod(payment?.method && payment.method !== '-' ? payment.method : 'Bank Transfer');
    setCustomer(payment?.customer || '');
    setOrderValue(String(Number(payment?.orderValue) || 0));
    setAmountCollected(String(Number(payment?.amountCollected) || 0));
    setPendingPayments(String(Number(payment?.pendingPayments) || 0));
    setUpcomingDues(String(Number(payment?.upcomingDues) || 0));
    setOverduePayments(String(Number(payment?.overduePayments) || 0));
    setDueDate(payment?.dueDate || '');
    setStatus(payment?.status || '');
  }, [isOpen, payment]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      customer,
      orderValue: Number(orderValue) || 0,
      amountCollected: Number(amountCollected) || 0,
      pendingPayments: Number(pendingPayments) || 0,
      upcomingDues: Number(upcomingDues) || 0,
      overduePayments: Number(overduePayments) || 0,
      dueDate,
      status,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="record-payment-content" onClick={(e) => e.stopPropagation()}>
        <div className="record-payment-header">
          <div className="record-payment-title-box">
            <div className="record-payment-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <FileEdit size={20} />
            </div>
            <div>
              <h2>{ro ? 'Payment Details' : 'Edit Invoice'}</h2>
              <p>{ro ? `Viewing invoice ${payment?.id || ''}` : `Update invoice details for ${payment?.id || ''}`}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="record-payment-body">
          <fieldset disabled={ro} style={{ border: 'none', padding: 0, margin: 0, minWidth: 0 }}>
          <div className="form-card">
            <h3 className="form-card-title">
              <User size={18} />
              Invoice Details
            </h3>

            <div className="form-grid-2-col">
              <div className="form-group form-group-2-span">
                <label className="form-label-caps">CUSTOMER NAME</label>
                <input
                  type="text"
                  className="form-input"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label-caps">ORDER VALUE</label>
                <div className="input-with-icon">
                  <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                  <input
                    type="text"
                    className="form-input"
                    value={orderValue}
                    onChange={(e) => setOrderValue(e.target.value)}
                    style={{ paddingLeft: '1.75rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">DUE DATE</label>
                <div className="input-with-icon">
                  <CalendarDays size={14} className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    style={{ paddingLeft: '2rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">AMOUNT COLLECTED</label>
                <div className="input-with-icon">
                  <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                  <input
                    type="text"
                    className="form-input"
                    value={amountCollected}
                    onChange={(e) => setAmountCollected(e.target.value)}
                    style={{ paddingLeft: '1.75rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">PENDING PAYMENTS</label>
                <div className="input-with-icon">
                  <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                  <input
                    type="text"
                    className="form-input"
                    value={pendingPayments}
                    onChange={(e) => setPendingPayments(e.target.value)}
                    style={{ paddingLeft: '1.75rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">UPCOMING DUES</label>
                <div className="input-with-icon">
                  <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                  <input
                    type="text"
                    className="form-input"
                    value={upcomingDues}
                    onChange={(e) => setUpcomingDues(e.target.value)}
                    style={{ paddingLeft: '1.75rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">OVERDUE PAYMENTS</label>
                <div className="input-with-icon">
                  <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                  <input
                    type="text"
                    className="form-input"
                    value={overduePayments}
                    onChange={(e) => setOverduePayments(e.target.value)}
                    style={{ paddingLeft: '1.75rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">STATUS</label>
                <div className="custom-select-wrapper">
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="Collected">Collected</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                  <ChevronDown size={14} className="select-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">PAYMENT METHOD</label>
                <div className="custom-select-wrapper">
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                  </select>
                  <ChevronDown size={14} className="select-icon" />
                </div>
              </div>

              {paymentMethod === 'Cash' && (
                <div className="form-group">
                  <label className="form-label-caps">WHOM</label>
                  <div className="custom-select-wrapper">
                    <select className="form-select" defaultValue="">
                      <option value="" disabled>Select receiver</option>
                      <option value="Manager">Manager</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Sales Executive">Sales Executive</option>
                    </select>
                    <ChevronDown size={14} className="select-icon" />
                  </div>
                </div>
              )}
            </div>
          </div>
          </fieldset>
        </div>

        <div className="record-payment-footer">
          {ro ? (
            <button className="btn btn--primary" style={{ background: '#3b82f6', borderColor: '#3b82f6', color: 'white' }} onClick={onClose}>Close</button>
          ) : (
            <>
              <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn--primary" style={{ background: '#3b82f6', borderColor: '#3b82f6', color: 'white' }} onClick={handleSave}>Save Changes</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
