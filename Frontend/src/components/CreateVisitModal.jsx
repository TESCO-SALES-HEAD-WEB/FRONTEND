import React from 'react';
import { X, CalendarDays } from 'lucide-react';
import './CreateVisitModal.css';

export default function CreateVisitModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="visit-modal-content">
        <div className="visit-modal-header">
          <h2 className="visit-modal-title">Create Visit Plan</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="visit-modal-body">
          <div className="form-group">
            <label className="form-label">CUSTOMER NAME</label>
            <input type="text" className="form-input" placeholder="Enter client's full name" />
          </div>
          
          <div className="form-group">
            <label className="form-label">LOCATION</label>
            <input type="text" className="form-input" placeholder="Enter site location or project address" />
          </div>
          
          <div className="form-group">
            <label className="form-label">DATE</label>
            <div className="input-with-icon">
              <input type="text" className="form-input" placeholder="17/07/2026" />
              <CalendarDays size={16} className="input-icon-right" />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">TIME / DURATION</label>
            <input type="text" className="form-input" placeholder="10:00 AM - 11:30 AM" />
          </div>
        </div>
        
        <div className="visit-modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={onClose}>Create Visit Plan</button>
        </div>
      </div>
    </div>
  );
}
