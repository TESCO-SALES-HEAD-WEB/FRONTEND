import React, { useState } from 'react';
import { 
  Users, Sparkles, Flame, Thermometer, Snowflake, 
  CalendarCheck, FileText, CheckCircle, Trash2, XCircle,
  ChevronDown, Activity, Edit2, Download, Trash, Edit3, Calendar
} from 'lucide-react';
import DateRangePicker from '../components/DateRangePicker';
import AddLeadModal from '../components/AddLeadModal';
import LeadDetailsDrawer from '../components/LeadDetailsDrawer';
import StatusUpdateModal from '../components/StatusUpdateModal';
import GenerateQuotationModal from '../components/GenerateQuotationModal';
import './Leads.css';

const mockLeads = [
  { 
    date: 'Jul 16, 2026', id: 'LD-1001', name: 'Reference Lead', type: '-', location: '-', services: 'PEB', value: '₹100k', phone: '+91 90000 00000', 
    source: 'WEBSITE ENQUIRY', sourceColor: 'blue',
    status: 'NEW LEAD', statusColor: 'blue', assignTo: 'Unassigned', followUp: '', notes: 'Sample r...'
  },
  { 
    date: 'Jul 16, 2026', id: 'LD-1002', name: 'Acme Corp', type: '-', location: '-', services: 'Tensile', value: '₹500k', phone: '+91 91234 56789', 
    source: 'REFERRAL', sourceColor: 'purple',
    status: 'HOT', statusColor: 'red', assignTo: 'Unassigned', followUp: '2026-07-15', notes: 'Intereste...'
  },
  { 
    date: 'Jul 16, 2026', id: 'LD-1003', name: 'TechFlow Pvt Ltd', type: '-', location: '-', services: 'PEB', value: '₹150k', phone: '+91 99887 76655', 
    source: 'COLD CALLING', sourceColor: 'orange',
    status: 'WARM', statusColor: 'yellow', assignTo: 'Unassigned', followUp: '2026-07-21', notes: 'Requires...'
  },
  { 
    date: 'Jul 16, 2026', id: 'LD-1004', name: 'Global Logistics', type: '-', location: '-', services: 'Other roofing', value: '₹200k', phone: '+91 98765 43210', 
    source: 'META LEADS', sourceColor: 'pink',
    status: 'COLD', statusColor: 'grey', assignTo: 'Unassigned', followUp: '', notes: 'Checkin...'
  },
  { 
    date: 'Jul 16, 2026', id: 'LD-1005', name: 'Skyline Builders', type: '-', location: '-', services: 'PEB', value: '₹800k', phone: '+91 97654 32109', 
    source: 'LINKEDIN LEADS', sourceColor: 'cyan',
    status: 'APPT FIXED', statusColor: 'green', assignTo: 'Mike Johnson', followUp: '2026-07-14', notes: 'Site visit ...'
  },
  { 
    date: 'Jul 16, 2026', id: 'LD-1006', name: 'Pioneer Enterprises', type: '-', location: '-', services: 'Tensile', value: '₹300k', phone: '+91 96543 21098', 
    source: 'ORGANIC LEADS', sourceColor: 'green',
    status: 'QUOTATION SEND', statusColor: 'slate', assignTo: 'Unassigned', followUp: '2026-07-15', notes: 'Sent quo...'
  },
  { 
    date: 'Jul 16, 2026', id: 'LD-1007', name: 'Zenith Mfg', type: '-', location: '-', services: 'PEB', value: '₹400k', phone: '+91 95432 10987', 
    source: 'WEBSITE ENQUIRY', sourceColor: 'blue',
    status: 'QUOTATION SEND', statusColor: 'slate', assignTo: 'Unassigned', followUp: '2026-07-21', notes: 'Discussi...'
  },
  { 
    date: 'Jul 16, 2026', id: 'LD-1008', name: 'Apex Industries', type: '-', location: '-', services: 'Other roofing', value: '₹120k', phone: '+91 94321 09876', 
    source: 'REFERRAL', sourceColor: 'purple',
    status: 'ORDER CONFIRMED', statusColor: 'emerald', assignTo: 'Mike Johnson', followUp: '', notes: 'Received...'
  },
  { 
    date: 'Jul 16, 2026', id: 'LD-1009', name: 'Nexus Tech', type: '-', location: '-', services: 'PEB', value: '₹60k', phone: '+91 93210 98765', 
    source: 'META LEADS', sourceColor: 'pink',
    status: 'JUNK', statusColor: 'grey', assignTo: 'Unassigned', followUp: '', notes: 'Out of se...'
  },
  { 
    date: 'Jul 16, 2026', id: 'LD-1010', name: 'Vertex Solutions', type: '-', location: '-', services: 'Tensile', value: '₹250k', phone: '+91 92109 87654', 
    source: 'COLD CALLING', sourceColor: 'orange',
    status: 'NEW LEAD', statusColor: 'blue', assignTo: 'Unassigned', followUp: '', notes: 'Sample r...'
  },
  { 
    date: 'Jul 16, 2026', id: 'LD-1011', name: 'Crest Retail', type: '-', location: '-', services: 'PEB', value: '₹600k', phone: '+91 91098 76543', 
    source: 'WEBSITE ENQUIRY', sourceColor: 'blue',
    status: 'HOT', statusColor: 'red', assignTo: 'Unassigned', followUp: '', notes: 'Intereste...'
  }
];

export default function Leads() {
  const [viewMode, setViewMode] = useState('manager');
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [leadSourceDropdownOpen, setLeadSourceDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [designReqDropdownOpen, setDesignReqDropdownOpen] = useState(false);
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerTab, setDrawerTab] = useState('specifications');
  const [leadsData, setLeadsData] = useState(mockLeads);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [selectedQuotationLead, setSelectedQuotationLead] = useState(null);

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'NEW LEAD': return 'blue';
      case 'HOT': return 'red';
      case 'WARM': return 'yellow';
      case 'COLD': return 'grey';
      case 'APPT FIXED': return 'green';
      case 'QUOTATION SEND': return 'slate';
      case 'ORDER CONFIRMED': return 'emerald';
      case 'JUNK': return 'grey';
      case 'LOST': return 'grey';
      default: return 'grey';
    }
  };

  const handleSaveStatus = (remark) => {
    if (!pendingStatusChange) return;
    const { lead, newStatus } = pendingStatusChange;
    
    setLeadsData(prev => prev.map(l => {
      if (l.id === lead.id) {
        return { 
          ...l, 
          status: newStatus, 
          statusColor: getStatusColor(newStatus) 
        };
      }
      return l;
    }));
    
    setPendingStatusChange(null);
  };

  // Filter States
  const [selectedService, setSelectedService] = useState('All');
  const [selectedLeadSource, setSelectedLeadSource] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDesignReq, setSelectedDesignReq] = useState('All');

  // Filter Logic
  const filteredLeads = leadsData.filter(lead => {
    if (selectedService !== 'All' && lead.services.toUpperCase() !== selectedService.toUpperCase()) return false;
    if (selectedLeadSource !== 'All' && lead.source.toUpperCase() !== selectedLeadSource.toUpperCase()) return false;
    if (selectedStatus !== 'All' && lead.status.toUpperCase() !== selectedStatus.toUpperCase()) return false;
    // mock data doesn't have designReq currently, skipping for mock
    return true;
  });

  return (
    <div className="leads-page">
      <div className="dashboard-header-bar">
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'manager' ? 'active' : ''}`}
            onClick={() => setViewMode('manager')}
          >
            Manager View
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'coordinator' ? 'active' : ''}`}
            onClick={() => setViewMode('coordinator')}
          >
            Coordinator View
          </button>
        </div>
      </div>

      <div className="leads-header">
        <h1>Lead Management</h1>
        <button className="btn btn--primary" onClick={() => setIsAddLeadModalOpen(true)}>
          + Add New Lead
        </button>
      </div>

      <div className="leads-filters">
        <DateRangePicker />
        <div className="custom-select-wrapper">
          <select className="btn btn--secondary filter-dropdown filter-select">
            {viewMode === 'manager' ? (
              <>
                <option value="all">All Managers</option>
                <option value="priya">Priya Sharma</option>
                <option value="amit">Amit Patel</option>
              </>
            ) : (
              <>
                <option value="all">All Coordinators</option>
                <option value="rahul">Rahul Kumar</option>
                <option value="sneha">Sneha Gupta</option>
              </>
            )}
          </select>
          <ChevronDown size={14} className="text-muted select-icon" />
        </div>
      </div>

      <div className="leads-overview">
        <h2 className="section-title">Overview</h2>
        <div className="grid-5-col">
          <div className="metric-card card-grey">
            <div className="metric-header"><span className="metric-title">Total Leads</span><Users size={16} /></div>
            <div className="metric-value">11</div><div className="metric-subtitle">All leads in system</div>
          </div>
          <div className="metric-card card-blue">
            <div className="metric-header"><span className="metric-title">New Leads</span><Sparkles size={16} /></div>
            <div className="metric-value">{viewMode === 'manager' ? '3' : '2'}</div><div className="metric-subtitle">Freshly received</div>
          </div>
          <div className="metric-card card-red">
            <div className="metric-header"><span className="metric-title">Hot Leads</span><Flame size={16} /></div>
            <div className="metric-value">1</div><div className="metric-subtitle">High conversion chance</div>
          </div>
          <div className="metric-card card-orange">
            <div className="metric-header"><span className="metric-title">Warm Leads</span><Thermometer size={16} /></div>
            <div className="metric-value">{viewMode === 'manager' ? '3' : '2'}</div><div className="metric-subtitle">Nurturing in progress</div>
          </div>
          <div className="metric-card card-slate">
            <div className="metric-header"><span className="metric-title">Cold Leads</span><Snowflake size={16} /></div>
            <div className="metric-value">{viewMode === 'manager' ? '2' : '1'}</div><div className="metric-subtitle">Need re-engagement</div>
          </div>
          <div className="metric-card card-green">
            <div className="metric-header"><span className="metric-title">Appt. Fixed</span><CalendarCheck size={16} /></div>
            <div className="metric-value">{viewMode === 'manager' ? '2' : '1'}</div><div className="metric-subtitle">Meetings scheduled</div>
          </div>
          <div className="metric-card card-purple">
            <div className="metric-header"><span className="metric-title">Quotation Sent</span><FileText size={16} /></div>
            <div className="metric-value">{viewMode === 'manager' ? '0' : '2'}</div><div className="metric-subtitle">Awaiting response</div>
          </div>
          <div className="metric-card card-emerald">
            <div className="metric-header"><span className="metric-title">Order Confirmed</span><CheckCircle size={16} /></div>
            <div className="metric-value">{viewMode === 'manager' ? '0' : '1'}</div><div className="metric-subtitle">Successfully closed</div>
          </div>
          <div className="metric-card card-slate">
            <div className="metric-header"><span className="metric-title">Junk</span><Trash2 size={16} /></div>
            <div className="metric-value">{viewMode === 'manager' ? '0' : '1'}</div><div className="metric-subtitle">Unqualified leads</div>
          </div>
          <div className="metric-card card-rose">
            <div className="metric-header"><span className="metric-title">{viewMode === 'manager' ? 'Lost Deal' : 'Lost'}</span><XCircle size={16} /></div>
            <div className="metric-value">0</div><div className="metric-subtitle">{viewMode === 'manager' ? 'Unsuccessful deals' : 'Unconverted leads'}</div>
          </div>
        </div>
      </div>

      <div className="table-container leads-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Lead ID</th>
              <th>Customer Name</th>
              <th>Work Type</th>
              <th>Project Location</th>
              <th className="th-interactive" onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}>
                {selectedService === 'All' ? 'SERVICES (ALL)' : `SERVICES (${selectedService.toUpperCase()})`} <ChevronDown size={14} style={{display:'inline', verticalAlign:'middle'}}/>
                
                {servicesDropdownOpen && (
                  <div className="dark-dropdown-menu">
                    <div className={`dark-dropdown-item ${selectedService === 'All' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedService('All'); setServicesDropdownOpen(false); }}>
                      {selectedService === 'All' && <span className="check-icon">✓</span>} SERVICES (ALL)
                    </div>
                    <div className={`dark-dropdown-item ${selectedService === 'PEB' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedService('PEB'); setServicesDropdownOpen(false); }}>
                      {selectedService === 'PEB' && <span className="check-icon">✓</span>} PEB
                    </div>
                    <div className={`dark-dropdown-item ${selectedService === 'Tensile' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedService('Tensile'); setServicesDropdownOpen(false); }}>
                      {selectedService === 'Tensile' && <span className="check-icon">✓</span>} TENSILE
                    </div>
                    <div className={`dark-dropdown-item ${selectedService === 'Other roofing' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedService('Other roofing'); setServicesDropdownOpen(false); }}>
                      {selectedService === 'Other roofing' && <span className="check-icon">✓</span>} OTHER ROOFING
                    </div>
                  </div>
                )}
              </th>
              <th>Project Value</th>
              <th>Phone Number</th>
              <th className="th-interactive" onClick={() => setLeadSourceDropdownOpen(!leadSourceDropdownOpen)}>
                {selectedLeadSource === 'All' ? 'LEAD SOURCE (ALL)' : selectedLeadSource.toUpperCase()} <ChevronDown size={14} style={{display:'inline', verticalAlign:'middle'}}/>
                
                {leadSourceDropdownOpen && (
                  <div className="dark-dropdown-menu" style={{right: 0, left: 'auto'}}>
                    <div className={`dark-dropdown-item ${selectedLeadSource === 'All' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedLeadSource('All'); setLeadSourceDropdownOpen(false); }}>
                      {selectedLeadSource === 'All' && <span className="check-icon">✓</span>} LEAD SOURCE (ALL)
                    </div>
                    {['REFERRAL', 'WEBSITE ENQUIRY', 'COLD CALLING', 'META LEADS', 'LINKEDIN LEADS', 'ORGANIC LEADS'].map(source => (
                      <div key={source} className={`dark-dropdown-item ${selectedLeadSource === source ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedLeadSource(source); setLeadSourceDropdownOpen(false); }}>
                        {selectedLeadSource === source && <span className="check-icon">✓</span>} {source}
                      </div>
                    ))}
                  </div>
                )}
              </th>
              
              {/* New Interactive Columns */}
              <th className="th-interactive" onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}>
                {selectedStatus === 'All' ? 'STATUS (ALL)' : selectedStatus.toUpperCase()} <ChevronDown size={14} style={{display:'inline', verticalAlign:'middle'}}/>
                
                {statusDropdownOpen && (
                  <div className="dark-dropdown-menu" style={{right: 0, left: 'auto'}}>
                    <div className={`dark-dropdown-item ${selectedStatus === 'All' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedStatus('All'); setStatusDropdownOpen(false); }}>
                      {selectedStatus === 'All' && <span className="check-icon">✓</span>} STATUS (ALL)
                    </div>
                    {['NEW LEAD', 'HOT', 'WARM', 'COLD', 'APPT FIXED', 'QUOTATION SEND', 'ORDER CONFIRMED', 'JUNK', 'LOST'].map(status => (
                      <div key={status} className={`dark-dropdown-item ${selectedStatus === status ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedStatus(status); setStatusDropdownOpen(false); }}>
                        {selectedStatus === status && <span className="check-icon">✓</span>} {status}
                      </div>
                    ))}
                  </div>
                )}
              </th>
              <th className="th-interactive" onClick={() => setDesignReqDropdownOpen(!designReqDropdownOpen)}>
                {selectedDesignReq === 'All' ? 'DESIGN REQ' : selectedDesignReq.toUpperCase()} <ChevronDown size={14} style={{display:'inline', verticalAlign:'middle'}}/>
                
                {designReqDropdownOpen && (
                  <div className="dark-dropdown-menu" style={{right: 0, left: 'auto'}}>
                    <div className={`dark-dropdown-item ${selectedDesignReq === 'All' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedDesignReq('All'); setDesignReqDropdownOpen(false); }}>
                      {selectedDesignReq === 'All' && <span className="check-icon">✓</span>} Select
                    </div>
                    {['2D Design', '3D Design', 'Both'].map(req => (
                      <div key={req} className={`dark-dropdown-item ${selectedDesignReq === req ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedDesignReq(req); setDesignReqDropdownOpen(false); }}>
                        {selectedDesignReq === req && <span className="check-icon">✓</span>} {req.toUpperCase()}
                      </div>
                    ))}
                  </div>
                )}
              </th>
              <th>Assign To (All) <ChevronDown size={14} style={{display:'inline', verticalAlign:'middle'}}/></th>
              <th>Follow Up</th>
              <th>Actions</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody className="leads-tbody">
            {filteredLeads.map((lead) => (
              <tr 
                key={lead.id} 
                className={`lead-row ${selectedLead?.id === lead.id ? 'selected-row' : ''}`}
                onClick={() => { setSelectedLead(lead); setDrawerTab('specifications'); }}
                style={{ cursor: 'pointer' }}
              >
                <td className="text-muted">{lead.date}</td>
                <td className="font-medium text-primary">{lead.id}</td>
                <td className="font-bold">{lead.name}</td>
                <td>{lead.type}</td>
                <td>{lead.location}</td>
                <td>{lead.services}</td>
                <td className="font-medium">{lead.value}</td>
                <td className="text-muted">{lead.phone}</td>
                <td>
                  <div className={`status-select-wrapper badge-${lead.sourceColor}`}>
                    <span className="source-dot" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}></span>
                    <select className="status-select" defaultValue={lead.source} style={{ paddingLeft: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
                      <option value={lead.source}>{lead.source}</option>
                      <option value="WEBSITE ENQUIRY">WEBSITE ENQUIRY</option>
                      <option value="REFERRAL">REFERRAL</option>
                      <option value="COLD CALLING">COLD CALLING</option>
                      <option value="META LEADS">META LEADS</option>
                      <option value="LINKEDIN LEADS">LINKEDIN LEADS</option>
                      <option value="ORGANIC LEADS">ORGANIC LEADS</option>
                    </select>
                    <ChevronDown size={14} className="status-chevron" />
                  </div>
                </td>
                
                {/* Status Column */}
                <td>
                  <div className={`status-select-wrapper badge-${lead.statusColor}`}>
                    <select 
                      className="status-select" 
                      value={lead.status} 
                      onChange={(e) => {
                        e.stopPropagation();
                        setPendingStatusChange({ lead, newStatus: e.target.value });
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="NEW LEAD">NEW LEAD</option>
                      <option value="HOT">HOT</option>
                      <option value="WARM">WARM</option>
                      <option value="COLD">COLD</option>
                      <option value="APPT FIXED">APPT FIXED</option>
                      <option value="QUOTATION SEND">QUOTATION SEND</option>
                      <option value="ORDER CONFIRMED">ORDER CONFIRMED</option>
                      <option value="JUNK">JUNK</option>
                      <option value="LOST">LOST</option>
                    </select>
                    <ChevronDown size={14} className="status-chevron" />
                  </div>
                </td>

                {/* Design Req Column */}
                <td>
                  <div className="table-select-wrapper">
                    <select className="table-select" defaultValue={lead.designReq?.length > 0 ? (lead.designReq.includes('2D') && lead.designReq.includes('3D') ? 'Both' : (lead.designReq.includes('2D') ? '2D Design' : '3D Design')) : 'Select'} onClick={(e) => e.stopPropagation()}>
                      <option value="Select" disabled>Select</option>
                      <option value="2D Design">2D Design</option>
                      <option value="3D Design">3D Design</option>
                      <option value="Both">Both</option>
                    </select>
                    <ChevronDown size={14} className="table-select-chevron" />
                  </div>
                </td>

                {/* Assign To Column */}
                <td>
                  <div className="table-select-wrapper">
                    <select className="table-select" defaultValue={lead.assignTo} onClick={(e) => e.stopPropagation()}>
                      <option value={lead.assignTo}>{lead.assignTo}</option>
                      <option value="Mike Johnson">Mike Johnson</option>
                    </select>
                    <ChevronDown size={14} className="table-select-chevron" />
                  </div>
                </td>

                {/* Follow Up Column */}
                <td>
                  <div className="table-date-wrapper">
                    <input 
                      type="date" 
                      className="table-date-input" 
                      defaultValue={lead.followUp}
                      placeholder="dd/mm/yyyy"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </td>

                {/* Actions Column */}
                <td>
                  <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="action-btn btn-activity"
                      onClick={() => { setSelectedLead(lead); setDrawerTab('timeline'); }}
                    >
                      <Activity size={14} />
                    </button>
                    <button 
                      className="action-btn btn-edit"
                      onClick={() => { setIsAddLeadModalOpen(true); }} // Assuming add lead modal acts as edit placeholder
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="action-btn btn-download"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuotationLead(lead);
                        setIsQuotationModalOpen(true);
                      }}
                    >
                      <Download size={14} />
                    </button>
                    <button 
                      className="action-btn btn-delete"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${lead.name}?`)) {
                          setLeadsData(prev => prev.filter(l => l.id !== lead.id));
                        }
                      }}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </td>

                {/* Notes Column */}
                <td>
                  <div className="notes-cell" onClick={(e) => e.stopPropagation()}>
                    <span className="notes-text text-muted">{lead.notes}</span>
                    <Edit3 size={14} className="notes-edit-icon" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isAddLeadModalOpen && (
        <AddLeadModal 
        isOpen={isAddLeadModalOpen} 
        onClose={() => setIsAddLeadModalOpen(false)} 
      />
      )}

      <LeadDetailsDrawer 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)} 
        lead={selectedLead}
        initialTab={drawerTab}
      />

      <StatusUpdateModal 
        isOpen={!!pendingStatusChange}
        onClose={() => setPendingStatusChange(null)}
        onSave={handleSaveStatus}
        newStatus={pendingStatusChange?.newStatus}
        statusColor={pendingStatusChange ? getStatusColor(pendingStatusChange.newStatus) : ''}
      />

      <GenerateQuotationModal 
        isOpen={isQuotationModalOpen} 
        onClose={() => setIsQuotationModalOpen(false)} 
        lead={selectedQuotationLead} 
      />
    </div>
  );
}
