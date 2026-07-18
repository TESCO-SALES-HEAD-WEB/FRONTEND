import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import './CreateVisitModal.css'; // Reusing base modal styles
import './UploadQuotationModal.css';

export default function UploadQuotationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="upload-quotation-content">
        <div className="visit-modal-header">
          <h2 className="visit-modal-title">Upload Quotation</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="upload-quotation-body">
          <div className="form-grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Lead ID</label>
              <input type="text" className="form-input" placeholder="e.g. LD-1007" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Client Name</label>
              <input type="text" className="form-input" placeholder="e.g. Acme Corp" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Services</label>
              <div className="custom-select-wrapper">
                <select className="form-select" defaultValue="">
                  <option value="" disabled>Select type</option>
                  <option value="PEB Building">PEB Building</option>
                  <option value="Tensile">Tensile</option>
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Project Value (₹)</label>
              <input type="text" className="form-input" placeholder="Enter project value" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Quotation Type</label>
              <div className="custom-select-wrapper">
                <select className="form-select" defaultValue="Initial Quotation">
                  <option value="Initial Quotation">Initial Quotation</option>
                  <option value="Revised Quotation">Revised Quotation</option>
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Upload File (PDF)</label>
              <div className="file-input-wrapper">
                <input type="file" accept=".pdf" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="visit-modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={onClose} style={{ background: '#1e1b4b', borderColor: '#1e1b4b' }}>Upload</button>
        </div>
      </div>
    </div>
  );
}
