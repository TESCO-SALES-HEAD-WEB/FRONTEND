import React, { useState, useEffect, useRef } from 'react';
import { X, Check, CalendarDays, FileText, LayoutList, UploadCloud, ChevronDown } from 'lucide-react';
import './AddLeadModal.css';

const CustomDropdown = ({ options, value, onChange, placeholder = "Select...", openUpward = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      <div className="custom-dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className={!value || value === placeholder ? "text-muted" : "truncate"}>{value || placeholder}</span>
        <ChevronDown size={16} color="#64748b" />
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu" style={openUpward ? { bottom: '100%', top: 'auto', marginBottom: '4px' } : {}}>
          {options.map(opt => (
            <div key={opt} className="custom-dropdown-option" onClick={() => { onChange(opt); setIsOpen(false); }}>
              <div className="custom-dropdown-check">
                {value === opt && <Check size={14} color="white" strokeWidth={3} />}
              </div>
              <span style={{ color: opt === placeholder ? '#9ca3af' : 'white' }}>{opt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const managerSteps = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Project Details' },
  { id: 3, label: 'Quotation' },
  { id: 4, label: 'Order confirmed' },
  { id: 5, label: 'Review' }
];

const coordinatorSteps = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Project Details' },
  { id: 3, label: 'Quotations' },
  { id: 4, label: 'Order Confirm' },
  { id: 5, label: 'Review' }
];

export default function AddLeadModal({ viewMode = 'coordinator', onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectType, setProjectType] = useState('Industrial');
  const [structureType, setStructureType] = useState('Clear Span');
  const [siteCondition, setSiteCondition] = useState('Flat');
  const [soilTest, setSoilTest] = useState('Done');
  const [siteVisit, setSiteVisit] = useState('Yes');
  const [startDate, setStartDate] = useState('Immediately');
  const [topService, setTopService] = useState('PEB Building');
  
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('PEB Building');
  const serviceOptions = ['PEB Building', 'Tensile', 'Other roofing', 'Other Service'];

  const [isRoofingDropdownOpen, setIsRoofingDropdownOpen] = useState(false);
  const [selectedRoofing, setSelectedRoofing] = useState('Select Roofing Type');
  const roofingOptions = [
    'Select Roofing Type', 'Tensile Roofing', 'UPVC Roofing', 'Polycarbonate Roofing', 
    'Glass Roofing', 'Mangalore Tile Roofing', 'Shingles Roofing', 'GI Roofing', 'Retractable Roofing'
  ];

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('APPOINTMENT FIXED');
  const statusOptions = [
    'NEW', 'HOT', 'WARM', 'COLD', 'APPOINTMENT FIXED', 
    'QUOTATION SEND', 'ORDER CONFIRMED', 'JUNK', 'LOST'
  ];

  const [leadSource, setLeadSource] = useState('WEBSITE ENQUIRY');
  const [budgetRange, setBudgetRange] = useState('5 - 10 Lakhs');
  const [expectedTimeline, setExpectedTimeline] = useState('Select Expected Timeline');
  const [step3Service, setStep3Service] = useState('PEB Building');
  const [quotationType, setQuotationType] = useState('Initial Quotation');

  const toggleService = (service) => {
    setSelectedService(service);
    setIsServiceDropdownOpen(false);
  };

  const activeSteps = viewMode === 'manager' ? managerSteps : coordinatorSteps;

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderPillGroup = (options, selected, setSelected) => (
    <div className="pill-group">
      {options.map(opt => (
        <div 
          key={opt}
          className={`pill-option ${selected === opt ? 'selected' : ''}`}
          onClick={() => setSelected(opt)}
        >
          {opt}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <>
      <h3 className="step-title">Basic Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Customer Name <span className="required-asterisk">*</span></label>
          <input type="text" className="form-input" placeholder="Enter customer name" />
        </div>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input type="text" className="form-input" placeholder="Enter company name" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Phone Number <span className="required-asterisk">*</span></label>
          <input type="text" className="form-input" placeholder="Enter phone number" />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" placeholder="Enter email address" />
        </div>

        <div className="form-group">
          <label className="form-label">Lead Source <span className="required-asterisk">*</span></label>
          <CustomDropdown 
            value={leadSource} 
            onChange={setLeadSource} 
            options={['WEBSITE ENQUIRY', 'REFERRAL', 'COLD CALL']} 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Service <span className="required-asterisk">*</span></label>
          <div className="custom-dropdown-container">
            <div 
              className="custom-dropdown-trigger" 
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
            >
              <span className="truncate">{selectedService || 'Select Service'}</span>
              <ChevronDown size={16} color="#64748b" />
            </div>
            
            {isServiceDropdownOpen && (
              <div className="custom-dropdown-menu">
                {serviceOptions.map(opt => (
                  <div 
                    key={opt} 
                    className="custom-dropdown-option"
                    onClick={() => toggleService(opt)}
                  >
                    <div className="custom-dropdown-check">
                      {selectedService === opt && <Check size={14} color="white" strokeWidth={3} />}
                    </div>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedService === 'Other roofing' && (
            <div className="custom-dropdown-container" style={{marginTop: '0.5rem'}}>
              <div 
                className="custom-dropdown-trigger" 
                onClick={() => setIsRoofingDropdownOpen(!isRoofingDropdownOpen)}
              >
                <span className="truncate">{selectedRoofing}</span>
                <ChevronDown size={16} color="#64748b" />
              </div>
              
              {isRoofingDropdownOpen && (
                <div className="custom-dropdown-menu">
                  {roofingOptions.map(opt => (
                    <div 
                      key={opt} 
                      className="custom-dropdown-option"
                      onClick={() => {
                        setSelectedRoofing(opt);
                        setIsRoofingDropdownOpen(false);
                      }}
                    >
                      <div className="custom-dropdown-check">
                        {selectedRoofing === opt && <Check size={14} color="white" strokeWidth={3} />}
                      </div>
                      <span style={{ color: opt === 'Select Roofing Type' ? '#9ca3af' : 'white' }}>{opt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedService === 'Other Service' && (
            <div style={{marginTop: '0.5rem'}}>
              <input type="text" className="form-input" placeholder="Enter Custom Service Type" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Project Location</label>
          <input type="text" className="form-input" placeholder="Enter project location" />
        </div>
        <div className="form-group">
          <label className="form-label">Assigned Manager <span className="required-asterisk">*</span></label>
          <input type="text" className="form-input" defaultValue="Sarah Smith" disabled={viewMode === 'manager'} />
          {viewMode === 'manager' && <span className="error-text">Fixed: Only Sales Coordinator can change executive</span>}
        </div>

        {viewMode === 'manager' && (
          <div className="form-group">
            <label className="form-label">Budget Range</label>
            <CustomDropdown 
              value={budgetRange} 
              onChange={setBudgetRange} 
              options={['5 - 10 Lakhs', '10 - 50 Lakhs']} 
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Expected Timeline</label>
          <CustomDropdown 
            value={expectedTimeline} 
            onChange={setExpectedTimeline} 
            placeholder="Select Expected Timeline"
            options={['Select Expected Timeline', 'Within 1 Month', '1-3 Months']} 
          />
        </div>
        {viewMode === 'coordinator' && <div className="form-group"></div>}

        <div className="form-group">
          <label className="form-label">Next Follow-up Date</label>
          <div className="input-with-icon">
            <input type="text" className="form-input" placeholder="dd/mm/yyyy" />
            <CalendarDays size={16} className="input-icon-right" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Status <span className="required-asterisk">*</span></label>
          <div className="custom-dropdown-container">
            <div 
              className="custom-dropdown-trigger" 
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            >
              <span className="truncate">{selectedStatus}</span>
              <ChevronDown size={16} color="#64748b" />
            </div>
            
            {isStatusDropdownOpen && (
              <div className="custom-dropdown-menu" style={{ bottom: '100%', top: 'auto', marginBottom: '4px' }}>
                {statusOptions.map(opt => (
                  <div 
                    key={opt} 
                    className="custom-dropdown-option"
                    onClick={() => {
                      setSelectedStatus(opt);
                      setIsStatusDropdownOpen(false);
                    }}
                  >
                    <div className="custom-dropdown-check">
                      {selectedStatus === opt && <Check size={14} color="white" strokeWidth={3} />}
                    </div>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderStep2 = () => {
    const topServiceOptions = viewMode === 'manager' 
      ? ['PEB Building', 'Tensile', 'Other roofing', 'Other Service'] 
      : ['PEB Building', 'Tensile', 'Other roofing', 'Other Service']; // Same in screenshot

    const projectTypeOptions = viewMode === 'manager'
      ? ['Industrial', 'Warehouse', 'Commercial', 'Cold Storage', 'Institutional', 'Other Service']
      : ['Industrial', 'Warehouse', 'Commercial', 'Cold Storage', 'Institutional', 'Other'];

    const structureTypeOptions = viewMode === 'manager'
      ? ['Clear Span', 'Multi span', 'Mezzanine', 'Multi storey', 'Other Service']
      : ['Clear Span', 'Multi-span', 'Mezzanine', 'Multi-storey', 'Other'];

    const siteConditionOptions = viewMode === 'manager'
      ? ['Flat', 'Slope', 'Filled', 'Rock', 'Other Service']
      : ['Flat', 'Slope', 'Filled', 'Rock', 'Other'];

    const startDateOptions = viewMode === 'manager'
      ? ['Immediately', 'Within 1 Month', 'Within 3 Months', 'Just Planning', 'Other Service']
      : ['Immediately', 'Within 1 Month', 'Within 3 Months', 'Just Planning', 'Other'];

    return (
      <>
        <h3 className="step-title">Project Details – {topService}</h3>
        {renderPillGroup(topServiceOptions, topService, setTopService)}
        
        <div style={{marginTop: '2rem'}}>
          <div className="form-group" style={{marginBottom: '1.5rem'}}>
            <label className="form-label">Project Type</label>
            {renderPillGroup(projectTypeOptions, projectType, setProjectType)}
          </div>
          
          <div className="form-group" style={{marginBottom: '1.5rem'}}>
            <label className="form-label">Structure Type</label>
            {renderPillGroup(structureTypeOptions, structureType, setStructureType)}
          </div>

          <div className="form-group" style={{marginBottom: '1.5rem'}}>
            <label className="form-label">Site Condition</label>
            {renderPillGroup(siteConditionOptions, siteCondition, setSiteCondition)}
          </div>

          <div className="form-group" style={{marginBottom: '1.5rem'}}>
            <label className="form-label">Soil Test Done?</label>
            {renderPillGroup(['Done', 'Not Done'], soilTest, setSoilTest)}
          </div>
        </div>

        <hr className="divider" />

        <h3 className="step-title" style={{fontSize: '1rem', marginBottom: '1rem'}}>Final Project Details</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Approximate Area</label>
            <div className="input-with-icon">
              <input type="text" className="form-input" placeholder={viewMode === 'manager' ? "Less than 5,000 sq. ft." : "Enter Sq.ft"} />
              <span className="input-icon-right" style={{fontSize: '0.875rem'}}>sq.ft</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Site Visit Required?</label>
            {renderPillGroup(['Yes', 'No'], siteVisit, setSiteVisit)}
          </div>
        </div>

        <div className="form-group" style={{marginTop: '1.5rem'}}>
          <label className="form-label">Expected Start Date</label>
          {renderPillGroup(startDateOptions, startDate, setStartDate)}
        </div>
      </>
    );
  };

  const renderStep3 = () => (
    <>
      <h3 className="step-title">Quotations Form</h3>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Lead ID</label>
          <input type="text" className="form-input" value="Pending Generation" disabled />
        </div>
        <div className="form-group">
          <label className="form-label">Client Name</label>
          <input type="text" className="form-input" placeholder="e.g. Acme Corp" />
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Services</label>
          <CustomDropdown 
            value={step3Service} 
            onChange={setStep3Service} 
            options={['PEB Building', 'Tensile']} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Quotation Type</label>
          <CustomDropdown 
            value={quotationType} 
            onChange={setQuotationType} 
            options={['Initial Quotation', 'Revised Quotation']} 
          />
        </div>
        {viewMode === 'coordinator' && (
          <div className="form-group">
            <label className="form-label">Project Value (₹)</label>
            <input type="text" className="form-input" placeholder="Enter project value" />
          </div>
        )}

        <div className="form-group" style={{ gridColumn: viewMode === 'manager' ? 'span 1' : 'span 2' }}>
          <label className="form-label">Upload File (PDF)</label>
          {viewMode === 'manager' ? (
            <input type="text" className="form-input" placeholder="Choose file..." disabled />
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="btn btn--secondary" style={{ padding: '0.5rem 1rem' }}>Choose file</button>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No file chosen</span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderStep4 = () => {
    if (viewMode === 'manager') {
      return (
        <>
          <h3 className="step-title">Project Attachments</h3>
          <div className="drag-drop-zone">
            <UploadCloud size={48} className="drag-drop-icon" strokeWidth={1.5} />
            <h4 className="drag-drop-title">Drag and drop files here</h4>
            <p className="drag-drop-subtitle">Supports Site Photos, CAD drawings, BOQ spreadsheets, Soil reports, and PDFs up to 50MB</p>
            <button className="btn btn--secondary">Select Files (Simulate Upload)</button>
            <p style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: '2rem'}}>No files uploaded yet. Click above to simulate an upload.</p>
          </div>
        </>
      );
    }

    return (
      <>
        <h3 className="step-title">Order Confirm Form</h3>
        
        {/* Section 1 */}
        <h4 className="step-subtitle"><FileText size={18} /> 1. Client & Project Details</h4>
        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Client Name <span className="required-asterisk">*</span></label>
            <input type="text" className="form-input" placeholder="e.g. Sree Brindavan Kindergarten" />
          </div>
          <div className="form-group">
            <label className="form-label">Project Location <span className="required-asterisk">*</span></label>
            <input type="text" className="form-input" placeholder="e.g. CN Rajapalayam" />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Details (Phone/Email)</label>
            <input type="text" className="form-input" placeholder="e.g. 9840714353 / ..." />
          </div>

          <div className="form-group">
            <label className="form-label">Billing Name</label>
            <input type="text" className="form-input" placeholder="e.g. Sree Brindavan Kindergarten" />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number <span className="required-asterisk">*</span></label>
            <input type="text" className="form-input" placeholder="e.g. 9001200000" />
          </div>
          <div className="form-group">
            <label className="form-label">Alternate Mobile Number</label>
            <input type="text" className="form-input" />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Site Address <span className="required-asterisk">*</span></label>
            <textarea className="form-input" rows="3" placeholder="e.g. 48, First Main Road..."></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Billing Address</label>
            <textarea className="form-input" rows="3"></textarea>
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
            <label className="form-label">Salesperson Name <span className="required-asterisk">*</span></label>
            <input type="text" className="form-input" defaultValue="Sarah Smith" />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Order <span className="required-asterisk">*</span></label>
            <div className="input-with-icon">
              <input type="text" className="form-input" placeholder="dd/mm/yyyy" />
              <CalendarDays size={16} className="input-icon-right" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Proposal Ref No <span className="required-asterisk">*</span></label>
            <input type="text" className="form-input" placeholder="e.g. TESH/HO/179/R1" />
          </div>
        </div>

        <hr className="divider" style={{margin: '1.5rem 0'}} />

        {/* Section 2 */}
        <h4 className="step-subtitle"><LayoutList size={18} /> 2. Scope of Work</h4>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Type of Project <span className="required-asterisk">*</span></label>
            <input type="text" className="form-input" defaultValue="PEB Building" />
          </div>
          <div className="form-group">
            <label className="form-label">Project Size/Area <span className="required-asterisk">*</span></label>
            <input type="text" className="form-input" placeholder="e.g. 700 Sq.ft" />
          </div>
        </div>
        <div className="form-grid" style={{marginTop: '1rem'}}>
          <div className="form-group">
            <div className="checkbox-group">
              <label className="checkbox-label"><input type="checkbox" /> 3D Design</label>
              <label className="checkbox-label"><input type="checkbox" /> 2D Design</label>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" style={{textTransform: 'none'}}>Transportation Client Scope</label>
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="trans" /> Yes</label>
                <label className="radio-label"><input type="radio" name="trans" /> No</label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{textTransform: 'none'}}>Scaffolding Client Scope</label>
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="scaf" /> Yes</label>
                <label className="radio-label"><input type="radio" name="scaf" /> No</label>
              </div>
            </div>
          </div>
        </div>

        <hr className="divider" style={{margin: '1.5rem 0'}} />

        {/* Section 3 */}
        <h4 className="step-subtitle"><CalendarDays size={18} /> 3. Timeline & Delivery Commitment</h4>
        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Tentative Start Date <span className="required-asterisk">*</span></label>
            <div className="input-with-icon">
              <input type="text" className="form-input" placeholder="dd/mm/yyyy" />
              <CalendarDays size={16} className="input-icon-right" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tentative Completion Date <span className="required-asterisk">*</span></label>
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

        <hr className="divider" style={{margin: '1.5rem 0'}} />

        {/* Section 4 */}
        <h4 className="step-subtitle"><span style={{color: '#10b981', fontWeight: 'bold'}}>₹</span> 4. Pricing & Payment Terms</h4>
        <div className="form-group" style={{maxWidth: '400px'}}>
          <label className="form-label">Quoted Price <span className="required-asterisk">*</span></label>
          <input type="text" className="form-input" placeholder="₹ Amount" />
        </div>
        <div className="form-group" style={{marginTop: '1.5rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
            <label className="form-label">Payment Terms Schedule</label>
            <button className="btn btn--secondary" style={{padding: '0.25rem 0.75rem', fontSize: '0.75rem'}}>+ Add Milestone</button>
          </div>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label" style={{fontSize:'0.65rem'}}>Term / Milestone</label>
              <input type="text" className="form-input" placeholder="e.g. Advance Payment" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{fontSize:'0.65rem'}}>Percentage (%)</label>
              <input type="text" className="form-input" placeholder="%" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{fontSize:'0.65rem'}}>Value (₹)</label>
              <input type="text" className="form-input" placeholder="₹ Amount" />
            </div>
          </div>
        </div>

        <hr className="divider" style={{margin: '1.5rem 0'}} />

        {/* Section 5 */}
        <h4 className="step-subtitle"><Check size={18} /> 5. Confirmations & Declarations</h4>
        <div className="form-group" style={{marginTop: '1rem'}}>
          <label style={{fontWeight: 700, fontSize: '0.875rem', color: '#1e293b'}}>5. Salesperson Declaration</label>
          <label className="checkbox-label" style={{marginTop: '0.5rem', alignItems: 'flex-start'}}>
            <input type="checkbox" style={{marginTop: '0.25rem'}} />
            <span style={{fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5}}>
              "I confirm that all details communicated to the client and project team are accurate and have been agreed upon. I also acknowledge that the project will commence once the design has been confirmed."
            </span>
          </label>
        </div>
        <div className="form-group signature-box">
          <label className="form-label" style={{textTransform:'none', fontWeight: 400}}>Signature of Salesperson:</label>
          <input type="text" className="signature-input" placeholder="Sign here..." />
        </div>
      </>
    );
  };

  const renderStep5 = () => {
    if (viewMode === 'manager') {
      return (
        <>
          <h3 className="step-title" style={{marginBottom: '0.25rem'}}>Review Lead Requirements</h3>
          <p style={{color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem'}}>Verify all parameters below before confirming saving lead records.</p>
          
          <div className="review-accordion">
            <div className="accordion-header">
              <span className="accordion-title">Customer & Basic Information</span>
              <ChevronDown size={16} color="#64748b" style={{transform: 'rotate(180deg)'}} />
            </div>
            <div className="accordion-content">
              <div className="review-grid" style={{gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem'}}>
                 <div className="review-item"><span className="review-label">Name:</span><span className="review-value">N/A</span></div>
                 <div className="review-item"><span className="review-label">Company:</span><span className="review-value">N/A</span></div>
                 <div className="review-item"><span className="review-label">Phone:</span><span className="review-value">N/A</span></div>
                 <div className="review-item"><span className="review-label">Email:</span><span className="review-value">N/A</span></div>
                 <div className="review-item"><span className="review-label">Location:</span><span className="review-value">N/A</span></div>
                 <div className="review-item"><span className="review-label">Sales Executive:</span><span className="review-value">Sarah Smith</span></div>
                 <div className="review-item"><span className="review-label">Priority:</span><span className="review-value">Medium</span></div>
                 <div className="review-item"><span className="review-label">Service:</span><span className="review-value">PEB Building</span></div>
              </div>
            </div>
          </div>
          
          <div className="review-accordion">
            <div className="accordion-header">
              <span className="accordion-title">Project Requirements (PEB Building)</span><ChevronDown size={16} color="#64748b" />
            </div>
          </div>
          <div className="review-accordion">
            <div className="accordion-header">
              <span className="accordion-title">Site Dimensions</span><ChevronDown size={16} color="#64748b" />
            </div>
          </div>
          <div className="review-accordion">
            <div className="accordion-header">
              <span className="accordion-title">Technical Details</span><ChevronDown size={16} color="#64748b" />
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <h3 className="step-title">Review Information</h3>
        
        <div className="review-card">
          <h4 className="review-card-title">1. Basic Information</h4>
          <div className="review-grid">
            <div className="review-item">
              <span className="review-label">Lead Source:</span>
              <span className="review-value">WEBSITE ENQUIRY</span>
            </div>
            <div className="review-item">
              <span className="review-label">Service:</span>
              <span className="review-value">PEB Building</span>
            </div>
            <div className="review-item">
              <span className="review-label">Assigned Manager:</span>
              <span className="review-value">Sarah Smith</span>
            </div>
            <div className="review-item">
              <span className="review-label">Status:</span>
              <span className="review-value">NEW</span>
            </div>
          </div>
        </div>

        <div className="review-card">
          <h4 className="review-card-title">2. Project Details</h4>
          <div className="review-grid">
            <div className="review-item">
              <span className="review-label">Priority:</span>
              <span className="review-value">Medium</span>
            </div>
            <div className="review-item">
              <span className="review-label">Structure Type:</span>
              <span className="review-value">Clear Span</span>
            </div>
            <div className="review-item">
              <span className="review-label">Installation Area:</span>
              <span className="review-value">Ground</span>
            </div>
            <div className="review-item">
              <span className="review-label">Existing Structure:</span>
              <span className="review-value">Yes</span>
            </div>
            <div className="review-item" style={{marginTop: '1rem'}}>
              <span className="review-label">Site Condition:</span>
              <span className="review-value">Flat</span>
            </div>
            <div className="review-item" style={{marginTop: '1rem'}}>
              <span className="review-label">Design 3D Required:</span>
              <span className="review-value">No</span>
            </div>
          </div>
        </div>

        <div className="review-card">
          <h4 className="review-card-title">3. Quotations</h4>
          <div className="review-grid">
            <div className="review-item">
              <span className="review-label">Quotation Generated:</span>
              <span className="review-value">Pending</span>
            </div>
            <div className="review-item">
              <span className="review-label">Estimated Revenue:</span>
              <span className="review-value">1000000</span>
            </div>
          </div>
        </div>

        <div className="review-card">
          <h4 className="review-card-title">4. Order Confirm</h4>
          <div className="review-grid">
            {/* Empty as per screenshot */}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="add-lead-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2>Add New Lead</h2>
            <div className="status-badge dot">Saved to draft</div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Stepper */}
        <div className="stepper-container">
          {activeSteps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            let className = 'step-pill';
            if (isActive) className += viewMode === 'manager' ? ' manager-active' : ' active';
            if (isCompleted) className += viewMode === 'manager' ? ' manager-completed' : ' completed';
            
            return (
              <div key={step.id} className={className}>
                <span className="step-number">
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : step.id}
                </span>
                {step.label}
              </div>
            );
          })}
        </div>

        {/* Body Area */}
        <div className="modal-content-body">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-left">
            <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-draft">Save Draft</button>
          </div>
          <div className="footer-right">
            {currentStep > 1 && (
              <button className="btn-back" onClick={handleBack}>&larr; Back</button>
            )}
            {currentStep < 5 ? (
              <button className="btn btn--primary" style={viewMode === 'manager' ? {backgroundColor: '#1e1b4b'} : {}} onClick={handleNext}>Next &rarr;</button>
            ) : (
              <>
                <button className="btn btn--primary" style={{backgroundColor: '#1e1b4b'}} onClick={onClose}>Save Lead</button>
                <button className="btn btn--primary" style={{backgroundColor: '#6366f1', color: 'white'}} onClick={onClose}>Save & Create Quotation</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
