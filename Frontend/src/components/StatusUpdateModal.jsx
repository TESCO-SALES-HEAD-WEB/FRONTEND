import React, { useState } from 'react';
import { X } from 'lucide-react';
import './StatusUpdateModal.css';

export default function StatusUpdateModal({ isOpen, onClose, onSave, newStatus, statusColor }) {
  const [remark, setRemark] = useState('');

  if (!isOpen) return null;

  return (
    <div className="sum-overlay">
      <div className="sum-modal" onClick={e => e.stopPropagation()}>
        <div className="sum-header">
          <h2>Status Update Remark</h2>
          <button className="sum-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="sum-content">
          <p className="sum-transition-text">
            You are changing the status to <span className={`sum-status-chip badge-${statusColor}`}>{newStatus}</span>.
          </p>
          
          <label className="sum-label">Add a Remark / Note for this transition:</label>
          <textarea
            className="sum-textarea"
            placeholder="e.g., Talked to client, they requested pricing details..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={4}
          />
        </div>

        <div className="sum-footer">
          <button className="btn sum-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn sum-btn-save" onClick={() => onSave(remark)}>Save Status</button>
        </div>
      </div>
    </div>
  );
}
