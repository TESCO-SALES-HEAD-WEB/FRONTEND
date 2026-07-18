import React, { useState } from 'react';
import { 
  Building2, 
  ClipboardList, 
  CalendarDays, 
  IndianRupee, 
  FileSignature,
  ChevronLeft,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './NewHandoverForm.css';

export default function NewHandoverForm() {
  const navigate = useNavigate();
  
  const [milestones, setMilestones] = useState([
    { term: '', percentage: '', value: '' }
  ]);

  const handleAddMilestone = () => {
    setMilestones([...milestones, { term: '', percentage: '', value: '' }]);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="handover-page">
      <div className="handover-header-container">
        <div className="handover-header-left">
          <button className="back-btn-circle" onClick={handleBack}>
            <ChevronLeft size={20} />
          </button>
          <div className="handover-title-wrapper">
            <div className="breadcrumbs">Pages / Projects / Projects</div>
            <h1>New Project File</h1>
            <div className="header-subtitle">Sales to Project Handover Form</div>
          </div>
        </div>
        <div className="handover-header-right">
          <button className="btn btn--secondary" onClick={handleBack}>Cancel</button>
          <button className="btn btn--primary" style={{ background: '#1e1b4b', borderColor: '#1e1b4b' }}>Submit Handover</button>
        </div>
      </div>

      {/* 1. Client & Project Details */}
      <div className="handover-section-card">
        <h2 className="handover-section-title">
          <Building2 size={20} className="section-icon" />
          1. Client & Project Details
        </h2>
        <div className="grid-3-col">
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input type="text" className="form-input" placeholder="e.g. Sree Hrindzavan Kindergarten" />
          </div>
          <div className="form-group">
            <label className="form-label">Project Location *</label>
            <input type="text" className="form-input" placeholder="e.g. Chitlapakkam" />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Details (Phone/Email)</label>
            <input type="text" className="form-input" placeholder="e.g. 984574312..." />
          </div>

          <div className="form-group">
            <label className="form-label">Billing Name</label>
            <input type="text" className="form-input" placeholder="e.g. Sree Hrindzavan Kindergarten" />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <input type="text" className="form-input" placeholder="e.g. 9851720000" />
          </div>
          <div className="form-group">
            <label className="form-label">Alternate Mobile Number</label>
            <input type="text" className="form-input" />
          </div>

          <div className="form-group form-group-2-span">
            <label className="form-label">Site Address *</label>
            <textarea className="form-input textarea-input" placeholder="e.g. 46, First main Road, Venkatraman Nagar, Chennai 600064"></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Billing Address</label>
            <textarea className="form-input textarea-input"></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">GST Number</label>
            <input type="text" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Email ID / WhatsApp Number</label>
            <input type="text" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Salesperson Name *</label>
            <input type="text" className="form-input" placeholder="e.g. Suseen Khan" />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Order *</label>
            <div className="input-with-icon">
              <input type="text" className="form-input" placeholder="dd/mm/yyyy" />
              <CalendarDays size={16} className="input-icon-right" />
            </div>
          </div>
          <div className="form-group form-group-2-span">
            <label className="form-label">Proposal Ref No *</label>
            <input type="text" className="form-input" placeholder="e.g. TCS/ENT/176-R1" />
          </div>
        </div>
      </div>

      {/* 2. Scope of Work */}
      <div className="handover-section-card">
        <h2 className="handover-section-title">
          <ClipboardList size={20} className="section-icon" />
          2. Scope of Work
        </h2>
        <div className="grid-2-col">
          <div className="form-group">
            <label className="form-label">Type of Project *</label>
            <input type="text" className="form-input" placeholder="e.g. PU Sheet Roof with wall panel cladding" />
          </div>
          <div className="form-group">
            <label className="form-label">Project Size/Area *</label>
            <input type="text" className="form-input" placeholder="e.g. 780 Sqft." />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <label className="custom-checkbox">
              <input type="checkbox" />
              <span className="checkmark"></span>
              3D Design
            </label>
            <label className="custom-checkbox">
              <input type="checkbox" />
              <span className="checkmark"></span>
              2D Design
            </label>
          </div>
          
          <div className="form-group" style={{ display: 'flex', gap: '3rem' }}>
            <div className="radio-group-wrapper">
              <label className="form-label">Transportation Client Scope</label>
              <div className="radio-group-inline">
                <label className="custom-radio">
                  <input type="radio" name="transportation" defaultChecked />
                  Yes
                </label>
                <label className="custom-radio">
                  <input type="radio" name="transportation" />
                  No
                </label>
              </div>
            </div>
            <div className="radio-group-wrapper">
              <label className="form-label">Scaffolding Client Scope</label>
              <div className="radio-group-inline">
                <label className="custom-radio">
                  <input type="radio" name="scaffolding" defaultChecked />
                  Yes
                </label>
                <label className="custom-radio">
                  <input type="radio" name="scaffolding" />
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Timeline & Delivery Commitment */}
      <div className="handover-section-card">
        <h2 className="handover-section-title">
          <CalendarDays size={20} className="section-icon" />
          3. Timeline & Delivery Commitment
        </h2>
        <div className="grid-3-col">
          <div className="form-group">
            <label className="form-label">Tentative Start Date *</label>
            <div className="input-with-icon">
              <input type="text" className="form-input" placeholder="dd/mm/yyyy" />
              <CalendarDays size={16} className="input-icon-right" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tentative Completion Date *</label>
            <div className="input-with-icon">
              <input type="text" className="form-input" placeholder="dd/mm/yyyy" />
              <CalendarDays size={16} className="input-icon-right" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Lead Time Promised</label>
            <input type="text" className="form-input" placeholder="e.g. 30 days" />
          </div>
        </div>
      </div>

      {/* 4. Pricing & Payment Terms */}
      <div className="handover-section-card">
        <h2 className="handover-section-title">
          <IndianRupee size={20} className="section-icon" />
          4. Pricing & Payment Terms
        </h2>
        
        <div className="form-group" style={{ marginBottom: '2rem', maxWidth: '400px' }}>
          <label className="form-label">Quoted Price *</label>
          <div className="input-with-icon">
            <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
            <input type="text" className="form-input" placeholder="Amount" style={{ paddingLeft: '1.75rem' }} />
          </div>
        </div>

        <div className="milestone-section">
          <div className="milestone-header-row">
            <label className="form-label" style={{ marginBottom: 0 }}>Payment Terms Schedule</label>
            <button className="btn btn--outline" onClick={handleAddMilestone} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Plus size={14} />
              Add Milestone
            </button>
          </div>
          <table className="milestone-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Term / Milestone</th>
                <th style={{ width: '30%' }}>Percentage (%)</th>
                <th style={{ width: '30%' }}>Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((milestone, idx) => (
                <tr key={idx}>
                  <td>
                    <input type="text" className="form-input" placeholder="e.g. Advance Payment" />
                  </td>
                  <td>
                    <input type="text" className="form-input" placeholder="%" />
                  </td>
                  <td>
                    <div className="input-with-icon">
                      <span className="input-icon-left" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                      <input type="text" className="form-input" placeholder="Amount" style={{ paddingLeft: '1.75rem' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5 & 6. Confirmations & Declarations */}
      <div className="handover-section-card">
        <h2 className="handover-section-title">
          <FileSignature size={20} className="section-icon" />
          5 & 6. Confirmations & Declarations
        </h2>
        
        <div className="declaration-box">
          <h3 className="declaration-title">5. Site Engineer Visit Completed</h3>
          <label className="custom-checkbox">
            <input type="checkbox" />
            <span className="checkmark"></span>
            Visit Completed
          </label>
        </div>

        <div className="declaration-box">
          <h3 className="declaration-title">6. Salesperson Declaration</h3>
          <label className="custom-checkbox" style={{ alignItems: 'flex-start' }}>
            <input type="checkbox" style={{ marginTop: '0.25rem' }} />
            <span className="checkmark" style={{ marginTop: '0.25rem' }}></span>
            <span className="declaration-text" style={{ margin: 0 }}>
              "I confirm that all details communicated to the client and project team are accurate and have been agreed upon. I also acknowledge that the project will commence once the design has been confirmed."
            </span>
          </label>
          
          <div className="signature-box" style={{ marginTop: '2rem', maxWidth: '300px' }}>
            <label className="form-label text-muted" style={{ fontSize: '0.75rem' }}>Signature of Salesperson:</label>
            <div style={{ height: '40px', borderBottom: '1px solid var(--border)', marginTop: '0.5rem', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ color: '#cbd5e1', fontStyle: 'italic', paddingBottom: '0.25rem' }}>Sign here...</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-actions">
        <button className="btn btn--primary" style={{ background: '#1e1b4b', borderColor: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileSignature size={18} />
          Generate Handover Form
        </button>
      </div>

    </div>
  );
}
