import React, { useState } from 'react';
import { 
  Calendar, ChevronDown, Filter, Flame, Activity, Snowflake, XCircle, 
  ArrowDownUp, Eye, Edit2, Trash2, CalendarDays
} from 'lucide-react';
import DateRangePicker from '../components/DateRangePicker';
import './Pipeline.css';

const initialPipeline = [
  {
    id: 'OP-1001', customer: 'Akash Kumar', company: 'ABC Builders', service: 'PEB Structure', stage: 'New', assignedTo: 'John Smith',
    expectedClose: '25 Jul 2026', projectValue: '₹8,50,000', lastActivity: 'Today', followUp: '15/07/2026'
  },
  {
    id: 'OP-1002', customer: 'Sarah Jenkins', company: 'Nexus Retail', service: 'Tensile Roofing', stage: 'Hot', assignedTo: 'Mike Johnson',
    expectedClose: '12 Aug 2026', projectValue: '₹12,00,000', lastActivity: 'Yesterday', followUp: '14/07/2026'
  },
  {
    id: 'OP-1003', customer: 'Ramesh Patel', company: 'Patel Logistics', service: 'PEB Structure', stage: 'Warm', assignedTo: 'Sarah Lee',
    expectedClose: '30 Jul 2026', projectValue: '₹45,00,000', lastActivity: '2 Days Ago', followUp: '21/07/2026'
  },
  {
    id: 'OP-1004', customer: 'Emma Watson', company: 'Watson Industries', service: 'Other roofing', stage: 'Cold', assignedTo: 'John Smith',
    expectedClose: '05 Aug 2026', projectValue: '₹3,25,000', lastActivity: 'Today', followUp: '15/07/2026'
  },
  {
    id: 'OP-1005', customer: 'David Chen', company: 'Oriental Tech', service: 'Tensile Roofing', stage: 'Appointment Fixed', assignedTo: 'Mike Johnson',
    expectedClose: '10 Jul 2026', projectValue: '₹22,50,000', lastActivity: '1 Week Ago', followUp: ''
  },
  {
    id: 'OP-1006', customer: 'Anita Desai', company: 'Desai Properties', service: 'PEB Structure', stage: 'Cold', assignedTo: 'Sarah Lee',
    expectedClose: '01 Jul 2026', projectValue: '₹5,00,000', lastActivity: '1 Month Ago', followUp: ''
  }
];

export default function Pipeline() {
  const [viewMode, setViewMode] = useState('manager');
  const [pipelineData, setPipelineData] = useState(initialPipeline);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const updateStage = (id, newStage) => {
    setPipelineData(pipelineData.map(deal => deal.id === id ? { ...deal, stage: newStage } : deal));
    setOpenDropdownId(null);
  };
  return (
    <div className="pipeline-page">
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

      <div className="pipeline-header-area">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="page-title">Sales Pipeline</h1>
        </div>
        
        <div className="pipeline-filters-top">
          <DateRangePicker />
          
          <div className="custom-select-wrapper">
            <select className="btn btn--secondary filter-dropdown filter-select">
              <option value="all">All Managers</option>
              <option value="john">John Smith</option>
              <option value="sarah">Sarah Lee</option>
            </select>
            <ChevronDown size={14} className="text-muted select-icon" />
          </div>
        </div>
      </div>

      <div className="pipeline-metrics-grid">
        <div className="metric-card card-blue">
          <div className="metric-header"><span className="metric-title">Total Pipeline</span><Filter size={16} /></div>
          <div className="metric-value">6</div><div className="metric-subtitle">All open deals</div>
        </div>
        <div className="metric-card card-red">
          <div className="metric-header"><span className="metric-title">Hot</span><Flame size={16} /></div>
          <div className="metric-value">1</div><div className="metric-subtitle">High probability</div>
        </div>
        <div className="metric-card card-orange">
          <div className="metric-header"><span className="metric-title">Warm</span><Activity size={16} /></div>
          <div className="metric-value">1</div><div className="metric-subtitle">Medium probability</div>
        </div>
        <div className="metric-card card-slate">
          <div className="metric-header"><span className="metric-title">Cold</span><Snowflake size={16} /></div>
          <div className="metric-value">2</div><div className="metric-subtitle">Low probability</div>
        </div>
        <div className="metric-card card-rose">
          <div className="metric-header"><span className="metric-title">Lost</span><XCircle size={16} /></div>
          <div className="metric-value">0</div><div className="metric-subtitle">Closed deals</div>
        </div>
      </div>

      <div className="pipeline-table-container">
        <div className="table-controls">
          {viewMode === 'coordinator' && (
            <input type="text" className="search-input" placeholder="Search Opportunity..." />
          )}
          
          <div className="filter-group">
            <div className="custom-select-wrapper">
              <select className="btn btn--secondary filter-dropdown filter-select">
                <option value="all">Filter by Stage</option>
              </select>
              <ChevronDown size={14} className="text-muted select-icon" />
            </div>
            
            {viewMode === 'coordinator' && (
              <div className="custom-select-wrapper">
                <select className="btn btn--secondary filter-dropdown filter-select">
                  <option value="all">Filter by Sales Executive</option>
                </select>
                <ChevronDown size={14} className="text-muted select-icon" />
              </div>
            )}
            
            <div className="custom-select-wrapper">
              <select className="btn btn--secondary filter-dropdown filter-select">
                <option value="all">Filter by Service</option>
              </select>
              <ChevronDown size={14} className="text-muted select-icon" />
            </div>
            
            <button className="btn-text">Reset Filters</button>
          </div>
        </div>

        <div className="pipeline-table-scrollable">
          <table className="pipeline-table">
            <thead>
            <tr style={viewMode === 'manager' ? { textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' } : {}}>
              <th>{viewMode === 'manager' ? 'Opportunity id' : 'Lead id'}</th>
              <th>Customer</th>
              {viewMode === 'manager' && <th>Company</th>}
              <th>Service</th>
              <th>Stage</th>
              <th>Assigned to</th>
              <th>Expected close</th>
              <th>Project value <ArrowDownUp size={12} className="sort-icon" /></th>
              <th>Last activity</th>
              <th>Follow-up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pipelineData.map((deal) => (
              <tr key={deal.id}>
                <td className="fw-600 font-medium text-primary">{deal.id}</td>
                <td className="fw-700">{deal.customer}</td>
                {viewMode === 'manager' && <td>{deal.company}</td>}
                <td className="text-muted">{deal.service}</td>
                <td style={{ position: 'relative' }}>
                  <div 
                    className={`stage-pill stage-pill--${deal.stage.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setOpenDropdownId(openDropdownId === deal.id ? null : deal.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {deal.stage} <ChevronDown size={12} className="ml-1" />
                  </div>
                  {openDropdownId === deal.id && (
                    <div className="pipeline-dropdown-menu">
                      {['New', 'Hot', 'Warm', 'Cold', 'Appointment Fixed'].map(stage => (
                        <div 
                          key={stage} 
                          className={`pipeline-dropdown-item ${deal.stage === stage ? 'active' : ''}`}
                          onClick={() => updateStage(deal.id, stage)}
                        >
                          {deal.stage === stage && <span className="check-icon">✓</span>} {stage}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="text-muted">{deal.assignedTo}</td>
                <td className="text-muted">{deal.expectedClose}</td>
                <td className="fw-700 text-success-bright">{deal.projectValue}</td>
                <td className="text-muted">{deal.lastActivity}</td>
                <td>
                  <div className="date-input-wrapper">
                    <input 
                      type="text" 
                      className="follow-up-input" 
                      placeholder="dd/mm/yyyy" 
                      defaultValue={deal.followUp}
                    />
                    <CalendarDays size={14} className="calendar-icon" />
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view-btn"><Eye size={14} /></button>
                    <button className="action-btn edit-btn"><Edit2 size={14} /></button>
                    <button className="action-btn delete-btn"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
        <div className="pagination-wrapper">
          <span className="pagination-info">Showing 1 to 6 of 142 entries</span>
          <div className="pagination-controls">
            <button className="page-btn">&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
