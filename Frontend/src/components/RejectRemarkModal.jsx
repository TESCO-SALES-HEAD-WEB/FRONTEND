import React, { useState } from 'react';
import { X } from 'lucide-react';
import './RejectRemarkModal.css';

export default function RejectRemarkModal({ isOpen, onClose, onConfirm, requestId }) {
  const [remark, setRemark] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(remark);
    setRemark(''); // Reset on submit
  };

  const handleClose = () => {
    setRemark(''); // Reset on cancel
    onClose();
  };

  return (
    <div className="reject-modal-overlay" onClick={handleClose}>
      <div className="reject-modal-container" onClick={e => e.stopPropagation()}>
        <div className="reject-modal-header">
          <h3 className="reject-modal-title">Reject Request {requestId ? `(${requestId})` : ''}</h3>
          <button className="reject-modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="reject-modal-body">
          <label className="reject-modal-label" htmlFor="remark-textarea">
            Please provide a reason for rejection:
          </label>
          <textarea 
            id="remark-textarea"
            className="reject-modal-textarea" 
            placeholder="Type your remark here..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            autoFocus
          ></textarea>
        </div>
        
        <div className="reject-modal-footer">
          <button className="reject-modal-btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="reject-modal-btn-confirm" 
            onClick={handleConfirm}
            disabled={!remark.trim()}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}
