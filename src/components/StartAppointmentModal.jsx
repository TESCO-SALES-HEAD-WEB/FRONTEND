import React from 'react';
import { X, Clock } from 'lucide-react';
import './StartAppointmentModal.css';

export default function StartAppointmentModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="start-apt-content" onClick={e => e.stopPropagation()}>
        <div className="start-apt-header">
          <h2>Start Appointment</h2>
          <button className="start-apt-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="start-apt-form">
          <div className="form-group">
            <div className="form-header">
              <label>Google Location URL / Address</label>
              <a href="#" className="change-link">Change address</a>
            </div>
            <input 
              type="text" 
              className="start-apt-input" 
              defaultValue="Virtual" 
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Start Time</label>
            <div className="time-row">
              <div className="time-input-wrapper">
                <input 
                  type="text" 
                  className="start-apt-input" 
                  defaultValue="03 : 54  PM" 
                />
                <Clock size={16} className="clock-icon" />
              </div>
              <button className="current-time-btn">Current Time</button>
            </div>
          </div>
        </div>

        <div className="start-apt-footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={onClose}>Start Appointment</button>
        </div>
      </div>
    </div>
  );
}
