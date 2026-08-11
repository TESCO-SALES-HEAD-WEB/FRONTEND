import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import './DesignRequirementModal.css';

export default function DesignRequirementModal({ isOpen, onClose, lead, designType }) {
  const [activeTab, setActiveTab] = useState(1);
  
  // State for toggles
  const [gutterProvision, setGutterProvision] = useState('No');

  if (!isOpen) return null;

  return (
    <div className="drm-overlay" onClick={onClose}>
      <div className="drm-container" onClick={e => e.stopPropagation()}>
        
        <div className="drm-header">
          <div className="drm-header-top">
            <div>
              <div className="drm-badges">
                <span className="drm-badge">{designType}</span>
                <span className="drm-lead-name">— {lead?.name || 'Reference Lead'}</span>
              </div>
              <h2 className="drm-title">Design Requirement Form</h2>
            </div>
            <button className="drm-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          <div className="drm-tabs">
            <button 
              className={`drm-tab ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              <div className="drm-tab-num">1</div>
              Site Dimensions
            </button>
            <button 
              className={`drm-tab ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => setActiveTab(2)}
            >
              <div className="drm-tab-num">2</div>
              Technical Details
            </button>
          </div>
        </div>

        <div className="drm-body">
          {activeTab === 1 && (
            <div className="drm-tab-content">
              <div className="drm-section">
                <div className="drm-section-title">OVERALL SITE</div>
                <div className="drm-grid">
                  <div className="drm-form-group">
                    <label className="drm-label">PLOT LENGTH</label>
                    <div className="drm-input-wrapper">
                      <input type="text" className="drm-input" placeholder="Enter length" />
                      <span className="drm-input-unit">ft</span>
                    </div>
                  </div>
                  <div className="drm-form-group">
                    <label className="drm-label">PLOT WIDTH</label>
                    <div className="drm-input-wrapper">
                      <input type="text" className="drm-input" placeholder="Enter width" />
                      <span className="drm-input-unit">ft</span>
                    </div>
                  </div>
                  <div className="drm-form-group">
                    <label className="drm-label">TOTAL AREA</label>
                    <div className="drm-input-wrapper">
                      <input type="text" className="drm-input" placeholder="Auto-calculated" disabled />
                      <span className="drm-input-unit">sqft</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="drm-section">
                <div className="drm-section-title">BUILDING AREA</div>
                <div className="drm-grid">
                  <div className="drm-form-group">
                    <label className="drm-label">BUILDING LENGTH</label>
                    <div className="drm-input-wrapper">
                      <input type="text" className="drm-input" placeholder="Enter length" />
                      <span className="drm-input-unit">ft</span>
                    </div>
                  </div>
                  <div className="drm-form-group">
                    <label className="drm-label">BUILDING WIDTH</label>
                    <div className="drm-input-wrapper">
                      <input type="text" className="drm-input" placeholder="Enter width" />
                      <span className="drm-input-unit">ft</span>
                    </div>
                  </div>
                  <div className="drm-form-group">
                    <label className="drm-label">BUILDING AREA</label>
                    <div className="drm-input-wrapper">
                      <input type="text" className="drm-input" placeholder="Auto-calculated" disabled />
                      <span className="drm-input-unit">sqft</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="drm-section">
                <div className="drm-section-title">ROOF SLOPE</div>
                <div className="drm-grid">
                  <div className="drm-form-group">
                    <div className="drm-input-wrapper">
                      <input type="text" className="drm-input" placeholder="e.g. 1:10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="drm-tab-content">
              <div className="drm-section-title" style={{marginBottom: '1rem'}}>SECTION 1 — STRUCTURAL SPECIFICATIONS</div>
              <div className="drm-grid" style={{marginBottom: '2rem'}}>
                <div className="drm-form-group">
                  <label className="drm-label">STRUCTURE GRADE</label>
                  <div className="drm-select-wrapper">
                    <select className="drm-select" defaultValue="Standard">
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                    <ChevronDown size={14} className="drm-select-icon" />
                  </div>
                </div>
                <div className="drm-form-group">
                  <label className="drm-label">PURLIN TYPE</label>
                  <div className="drm-select-wrapper">
                    <select className="drm-select" defaultValue="">
                      <option value="" disabled>Select...</option>
                      <option value="Z Purlin">Z Purlin</option>
                      <option value="C Purlin">C Purlin</option>
                    </select>
                    <ChevronDown size={14} className="drm-select-icon" />
                  </div>
                </div>
                <div className="drm-form-group">
                  <label className="drm-label">WIND SPEED</label>
                  <div className="drm-input-wrapper">
                    <input type="text" className="drm-input" placeholder="Enter speed" />
                    <span className="drm-input-unit">m/s</span>
                  </div>
                </div>
                <div className="drm-form-group">
                  <label className="drm-label">SNOW LOAD</label>
                  <div className="drm-input-wrapper">
                    <input type="text" className="drm-input" placeholder="Enter load" />
                    <span className="drm-input-unit">kN/m²</span>
                  </div>
                </div>
              </div>

              <div className="drm-section-title" style={{marginBottom: '1rem'}}>SECTION 2 — ROOFING & CLADDING</div>
              <div className="drm-grid" style={{marginBottom: '2rem'}}>
                <div className="drm-form-group">
                  <label className="drm-label">ROOFING SHEET TYPE</label>
                  <div className="drm-select-wrapper">
                    <select className="drm-select" defaultValue="">
                      <option value="" disabled>Select...</option>
                      <option value="Bare Galvalume">Bare Galvalume</option>
                      <option value="Color Coated">Color Coated</option>
                    </select>
                    <ChevronDown size={14} className="drm-select-icon" />
                  </div>
                </div>
                <div className="drm-form-group">
                  <label className="drm-label">ROOFING SHEET THICKNESS</label>
                  <div className="drm-select-wrapper">
                    <select className="drm-select" defaultValue="">
                      <option value="" disabled>Select...</option>
                      <option value="0.47mm">0.47mm</option>
                      <option value="0.50mm">0.50mm</option>
                    </select>
                    <ChevronDown size={14} className="drm-select-icon" />
                  </div>
                </div>
                <div className="drm-form-group">
                  <label className="drm-label">WALL CLADDING</label>
                  <div className="drm-select-wrapper">
                    <select className="drm-select" defaultValue="">
                      <option value="" disabled>Select...</option>
                      <option value="Included">Included</option>
                      <option value="Excluded">Excluded</option>
                    </select>
                    <ChevronDown size={14} className="drm-select-icon" />
                  </div>
                </div>
                <div className="drm-form-group">
                  <label className="drm-label">GUTTER PROVISION</label>
                  <div className="drm-toggle-group">
                    <button 
                      className={`drm-toggle-btn ${gutterProvision === 'Yes' ? 'active' : ''}`}
                      onClick={() => setGutterProvision('Yes')}
                    >
                      Yes
                    </button>
                    <button 
                      className={`drm-toggle-btn ${gutterProvision === 'No' ? 'active' : ''}`}
                      onClick={() => setGutterProvision('No')}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="drm-section-title" style={{marginBottom: '1rem'}}>SECTION 3 — DOORS & WINDOWS</div>
              <div className="drm-grid" style={{marginBottom: '2rem'}}>
                 {/* Empty as per screenshot, but we could add placeholders */}
                 <div className="drm-form-group" style={{gridColumn: '1 / -1'}}>
                    <div style={{color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic'}}>No doors or windows specified yet.</div>
                 </div>
              </div>

            </div>
          )}
        </div>

        <div className="drm-footer">
          <button 
            className="drm-btn-back" 
            disabled={activeTab === 1}
            onClick={() => setActiveTab(1)}
          >
            <ChevronLeft size={16} /> Back
          </button>
          
          {activeTab === 1 ? (
            <button className="drm-btn-next" onClick={() => setActiveTab(2)}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button className="drm-btn-next" onClick={() => {
              alert('Design Requirements Saved!');
              onClose();
            }}>
              Save Details
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}
