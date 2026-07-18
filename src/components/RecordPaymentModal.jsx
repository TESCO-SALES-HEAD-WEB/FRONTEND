import React from 'react';
import { X, CreditCard, IndianRupee, CalendarDays, ChevronDown } from 'lucide-react';
import './RecordPaymentModal.css';

export default function RecordPaymentModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="record-payment-content" onClick={(e) => e.stopPropagation()}>
        <div className="record-payment-header">
          <div className="record-payment-title-box">
            <div className="record-payment-icon">
              <CreditCard size={20} />
            </div>
            <div>
              <h2>Record Payment</h2>
              <p>Log a new payment receipt.</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="record-payment-body">
          <div className="form-card">
            <h3 className="form-card-title">
              <IndianRupee size={18} />
              Transaction Details
            </h3>
            
            <div className="form-grid-2-col">
              <div className="form-group">
                <label className="form-label-caps">AMOUNT COLLECT</label>
                <div className="input-with-icon">
                  <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                  <input type="text" className="form-input" placeholder="0.00" style={{ paddingLeft: '1.75rem' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">PAYMENT METHOD</label>
                <div className="custom-select-wrapper">
                  <select className="form-select" defaultValue="Bank Transfer">
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                  </select>
                  <ChevronDown size={14} className="select-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-caps">TRANSACTION ID / CHEQUE NO.</label>
                <input type="text" className="form-input" placeholder="e.g. TXN987654321" />
              </div>

              <div className="form-group">
                <label className="form-label-caps">PAYMENT DATE</label>
                <div className="input-with-icon">
                  <CalendarDays size={14} className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" className="form-input" defaultValue="17/07/2026" style={{ paddingLeft: '2rem' }} />
                  <CalendarDays size={14} className="input-icon-right" />
                </div>
              </div>
            </div>
          </div>

          <div className="form-card">
            <label className="form-label-caps">PAYMENT NOTES & REMARKS</label>
            <textarea 
              className="form-input textarea-input" 
              placeholder="Add any details about this payment..."
            ></textarea>
          </div>
        </div>

        <div className="record-payment-footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-save-green">Save Record</button>
        </div>
      </div>
    </div>
  );
}
