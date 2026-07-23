import React from 'react';
import { X, FileEdit, User, IndianRupee, CalendarDays, ChevronDown } from 'lucide-react';
import './RecordPaymentModal.css'; // Reusing the same CSS for consistent modal styling

export default function EditInvoiceModal({ isOpen, onClose, payment }) {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = React.useState(payment?.method && payment.method !== '-' ? payment.method : "Bank Transfer");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="record-payment-content" onClick={(e) => e.stopPropagation()}>
        <div className="record-payment-header">
          <div className="record-payment-title-box">
            <div className="record-payment-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <FileEdit size={20} />
            </div>
            <div>
              <h2>Edit Invoice</h2>
              <p>Update invoice details for {payment?.id}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="record-payment-body">
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
                  defaultValue={payment?.customer || ''} 
                />
              </div>

              <div className="form-group">
                <label className="form-label-caps">ORDER VALUE</label>
                <div className="input-with-icon">
                  <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    defaultValue={payment ? payment.orderValue.replace('₹', '').replace(/,/g, '') : ''}
                    style={{ paddingLeft: '1.75rem' }} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">DUE DATE</label>
                <div className="input-with-icon">
                  <CalendarDays size={14} className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" className="form-input" defaultValue={payment?.dueDate || ""} style={{ paddingLeft: '2rem' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">AMOUNT COLLECTED</label>
                <div className="input-with-icon">
                  <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    defaultValue={payment ? payment.amountCollect.replace('₹', '').replace(/,/g, '') : ''}
                    style={{ paddingLeft: '1.75rem' }} 
                  />
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
        </div>

        <div className="record-payment-footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" style={{ background: '#3b82f6', borderColor: '#3b82f6', color: 'white' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
