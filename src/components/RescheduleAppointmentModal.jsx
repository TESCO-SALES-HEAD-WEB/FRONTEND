import React from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import './RescheduleAppointmentModal.css';

export default function RescheduleAppointmentModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="reschedule-modal-content" onClick={e => e.stopPropagation()}>
        <div className="reschedule-header">
          <h2>Reschedule Appointment</h2>
          <button className="reschedule-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="reschedule-form">
          <div className="form-group">
            <label>New Date</label>
            <div className="reschedule-input-wrapper">
              <input 
                type="text" 
                className="reschedule-input" 
                defaultValue="08/07/2026" 
              />
              <Calendar size={16} className="reschedule-icon" />
            </div>
          </div>

          <div className="form-group">
            <label>Time Duration</label>
            <div className="time-duration-row">
              <div className="reschedule-input-wrapper" style={{ flex: 1 }}>
                <input 
                  type="text" 
                  className="reschedule-input" 
                  defaultValue="10:00 AM" 
                />
                <Clock size={16} className="reschedule-icon" />
              </div>
              <span className="time-to">to</span>
              <div className="reschedule-input-wrapper" style={{ flex: 1 }}>
                <input 
                  type="text" 
                  className="reschedule-input" 
                  defaultValue="11:00 AM" 
                />
                <Clock size={16} className="reschedule-icon" />
              </div>
            </div>
          </div>
        </div>

        <div className="reschedule-footer">
          <button className="btn btn--outline" onClick={onClose}>Cancel</button>
          <button className="btn-confirm-reschedule" onClick={onClose}>Confirm Reschedule</button>
        </div>
      </div>
    </div>
  );
}
