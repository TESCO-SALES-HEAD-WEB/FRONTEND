import React from 'react';
import { X, CalendarDays, Clock, ChevronDown } from 'lucide-react';
import './CreateVisitModal.css'; // Reusing base modal styles
import './ScheduleVisitModal.css';

export default function ScheduleVisitModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="schedule-visit-content">
        <div className="visit-modal-header">
          <h2 className="visit-modal-title">Schedule New Visit</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="schedule-visit-body">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Manager Name</label>
            <div className="custom-select-wrapper">
              <select className="form-select" defaultValue="">
                <option value="" disabled>Select Manager</option>
                <option value="john">John Doe</option>
                <option value="jane">Jane Smith</option>
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="text" className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" className="form-input" />
          </div>
          
          <div className="form-grid-3-col">
            <div className="form-group">
              <label className="form-label">Date</label>
              <div className="input-with-icon">
                <input type="text" className="form-input" placeholder="dd/mm/yyyy" />
                <CalendarDays size={16} className="input-icon-right" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <div className="input-with-icon">
                <input type="text" className="form-input" placeholder="-- : --  --" />
                <Clock size={16} className="input-icon-right time-input-icon" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <div className="input-with-icon">
                <input type="text" className="form-input" placeholder="-- : --  --" />
                <Clock size={16} className="input-icon-right time-input-icon" />
              </div>
            </div>
          </div>

          <div className="form-grid-2-col">
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="custom-select-wrapper">
                <select className="form-select" defaultValue="Appointment">
                  <option value="Appointment">Appointment</option>
                  <option value="Site Visit">Site Visit</option>
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="custom-select-wrapper">
                <select className="form-select" defaultValue="Waiting">
                  <option value="Waiting">Waiting</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="visit-modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={onClose} style={{ background: '#2e2760', borderColor: '#2e2760' }}>Schedule Visit</button>
        </div>
      </div>
    </div>
  );
}
