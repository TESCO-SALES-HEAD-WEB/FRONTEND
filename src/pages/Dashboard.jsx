import React, { useState } from 'react';
import { 
  Calendar, ChevronDown, Users, Sparkles, Flame, Thermometer, Snowflake,
  CalendarCheck, FileText, CheckCircle, Trash2, XCircle,
  CalendarDays, CheckCircle2, Flag, 
  FileSignature, Clock, Send, ThumbsUp,
  IndianRupee, AlertCircle, Activity,
  Archive, FileArchive, CheckSquare
} from 'lucide-react';
import DateRangePicker from '../components/DateRangePicker';
import './Dashboard.css';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState('manager'); // 'manager' | 'coordinator'

  return (
    <div className="dashboard-container">
      
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

        <div className="dashboard-filters">
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
      </div>

      <div className="welcome-banner mb-2">
        <div className="banner-content">
          <h1>Welcome Back, Sarah 👋</h1>
          <p>Manage construction leads, appointments, quotations, and project coordination efficiently.</p>
        </div>
      </div>

      {viewMode === 'coordinator' && (
        <>

          <div className="dashboard-section">
            <h2 className="section-title">Leads Overview</h2>
            <div className="grid-5-col">
              <div className="metric-card card-grey">
                <div className="metric-header"><span className="metric-title">Total Leads</span><Users size={16} /></div>
                <div className="metric-value">11</div><div className="metric-subtitle">All leads in system</div>
              </div>
              <div className="metric-card card-blue">
                <div className="metric-header"><span className="metric-title">New Leads</span><Sparkles size={16} /></div>
                <div className="metric-value">2</div><div className="metric-subtitle">Freshly received</div>
              </div>
              <div className="metric-card card-red">
                <div className="metric-header"><span className="metric-title">Hot Leads</span><Flame size={16} /></div>
                <div className="metric-value">1</div><div className="metric-subtitle">High conversion chance</div>
              </div>
              <div className="metric-card card-orange">
                <div className="metric-header"><span className="metric-title">Warm Leads</span><Thermometer size={16} /></div>
                <div className="metric-value">2</div><div className="metric-subtitle">Nurturing in progress</div>
              </div>
              <div className="metric-card card-slate">
                <div className="metric-header"><span className="metric-title">Cold Leads</span><Snowflake size={16} /></div>
                <div className="metric-value">1</div><div className="metric-subtitle">Need re-engagement</div>
              </div>
              <div className="metric-card card-green">
                <div className="metric-header"><span className="metric-title">Appt. Fixed</span><CalendarCheck size={16} /></div>
                <div className="metric-value">1</div><div className="metric-subtitle">Meetings scheduled</div>
              </div>
              <div className="metric-card card-purple">
                <div className="metric-header"><span className="metric-title">Quotation Send</span><FileText size={16} /></div>
                <div className="metric-value">2</div><div className="metric-subtitle">Awaiting response</div>
              </div>
              <div className="metric-card card-emerald">
                <div className="metric-header"><span className="metric-title">Order Confirmed</span><CheckCircle size={16} /></div>
                <div className="metric-value">1</div><div className="metric-subtitle">Successfully closed</div>
              </div>
              <div className="metric-card card-slate">
                <div className="metric-header"><span className="metric-title">Junk</span><Trash2 size={16} /></div>
                <div className="metric-value">1</div><div className="metric-subtitle">Unqualified leads</div>
              </div>
              <div className="metric-card card-rose">
                <div className="metric-header"><span className="metric-title">Lost</span><XCircle size={16} /></div>
                <div className="metric-value">0</div><div className="metric-subtitle">Unconverted leads</div>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">Appointments</h2>
            <div className="grid-4-col">
              <div className="metric-card card-indigo">
                <div className="metric-header"><span className="metric-title">Total Appointments</span><CalendarDays size={16} /></div>
                <div className="metric-value">10</div><div className="metric-subtitle">All scheduled appointments</div>
              </div>
              <div className="metric-card card-blue">
                <div className="metric-header"><span className="metric-title">Total Visit Planned</span><Calendar size={16} /></div>
                <div className="metric-value">8</div><div className="metric-subtitle">Upcoming & pending visits</div>
              </div>
              <div className="metric-card card-green">
                <div className="metric-header"><span className="metric-title">Completed Appointments</span><CheckCircle2 size={16} /></div>
                <div className="metric-value">2</div><div className="metric-subtitle">Successfully completed</div>
              </div>
              <div className="metric-card card-orange">
                <div className="metric-header"><span className="metric-title">Total Visit Complete</span><Flag size={16} /></div>
                <div className="metric-value">1</div><div className="metric-subtitle">Site visits wrapped up</div>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">Quotations</h2>
            <div className="grid-4-col">
              <div className="metric-card card-indigo"><div className="metric-header"><span className="metric-title">Requested Quotations</span><FileSignature size={16} /></div><div className="metric-value">1</div><div className="metric-subtitle">Draft & initial requests</div></div>
              <div className="metric-card card-yellow"><div className="metric-header"><span className="metric-title">Pending Quotations</span><Clock size={16} /></div><div className="metric-value">1</div><div className="metric-subtitle">Awaiting client/mgr approval</div></div>
              <div className="metric-card card-blue"><div className="metric-header"><span className="metric-title">Completed Quotations</span><Send size={16} /></div><div className="metric-value">0</div><div className="metric-subtitle">Prepared & sent to clients</div></div>
              <div className="metric-card card-emerald"><div className="metric-header"><span className="metric-title">Approved Quotations</span><ThumbsUp size={16} /></div><div className="metric-value">0</div><div className="metric-subtitle">Accepted quotations</div></div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">Payments</h2>
            <div className="grid-4-col">
              <div className="metric-card card-green"><div className="metric-header"><span className="metric-title">Total Collected</span><CheckCircle size={16} /></div><div className="metric-value">₹2.4Cr</div><div className="metric-subtitle">Total Collected</div></div>
              <div className="metric-card card-indigo"><div className="metric-header"><span className="metric-title">Upcoming Dues</span><Clock size={16} /></div><div className="metric-value">₹45L</div><div className="metric-subtitle">Upcoming Dues</div></div>
              <div className="metric-card card-yellow"><div className="metric-header"><span className="metric-title">Pending Payments</span><AlertCircle size={16} /></div><div className="metric-value">₹12L</div><div className="metric-subtitle">Pending Payments</div></div>
              <div className="metric-card card-rose"><div className="metric-header"><span className="metric-title">Overdue Payments</span><XCircle size={16} /></div><div className="metric-value">₹8.5L</div><div className="metric-subtitle">Overdue Payments</div></div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'manager' && (
        <>
          <div className="dashboard-section">
            <h2 className="section-title border-title">Lead Management</h2>
            <div className="grid-4-col">
              <div className="metric-card card-purple"><div className="metric-header"><span className="metric-title">Total Leads</span><Users size={16} /></div><div className="metric-value">11</div><div className="metric-subtitle">All leads in system</div></div>
              <div className="metric-card card-blue"><div className="metric-header"><span className="metric-title">New Leads</span><Sparkles size={16} /></div><div className="metric-value">3</div><div className="metric-subtitle">Freshly received</div></div>
              <div className="metric-card card-red"><div className="metric-header"><span className="metric-title">Hot Leads</span><Flame size={16} /></div><div className="metric-value">1</div><div className="metric-subtitle">High conversion chance</div></div>
              <div className="metric-card card-orange"><div className="metric-header"><span className="metric-title">Warm Leads</span><Thermometer size={16} /></div><div className="metric-value">3</div><div className="metric-subtitle">Nurturing in progress</div></div>
              
              <div className="metric-card card-blue"><div className="metric-header"><span className="metric-title">Cold Leads</span><Snowflake size={16} /></div><div className="metric-value">2</div><div className="metric-subtitle">Need re-engagement</div></div>
              <div className="metric-card card-orange"><div className="metric-header"><span className="metric-title">Lost Deal</span><XCircle size={16} /></div><div className="metric-value">0</div><div className="metric-subtitle">Unsuccessful deals</div></div>
              <div className="metric-card card-slate"><div className="metric-header"><span className="metric-title">Junk</span><Trash2 size={16} /></div><div className="metric-value">0</div><div className="metric-subtitle">Unqualified leads</div></div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title border-title">Appointments</h2>
            <div className="grid-4-col">
              <div className="metric-card card-blue"><div className="metric-header"><span className="metric-title">Total Appointments</span><CalendarDays size={16} /></div><div className="metric-value">42</div><div className="metric-subtitle">Scheduled this month</div></div>
              <div className="metric-card card-purple"><div className="metric-header"><span className="metric-title">Total Visit Planned</span><Activity size={16} /></div><div className="metric-value">18</div><div className="metric-subtitle">Planned site visits</div></div>
              <div className="metric-card card-green"><div className="metric-header"><span className="metric-title">Appointment Complete</span><Users size={16} /></div><div className="metric-value">28</div><div className="metric-subtitle">+5 Completed Today</div></div>
              <div className="metric-card card-orange"><div className="metric-header"><span className="metric-title">Total Visit Completed</span><CheckCircle size={16} /></div><div className="metric-value">12</div><div className="metric-subtitle">Done this week</div></div>
              
              <div className="metric-card card-slate"><div className="metric-header"><span className="metric-title">Rescheduled Appointment</span><Clock size={16} /></div><div className="metric-value">4</div><div className="metric-subtitle">Needs follow-up</div></div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title border-title">Quotations</h2>
            <div className="grid-4-col">
              <div className="metric-card card-blue"><div className="metric-header"><span className="metric-title">Requested Quotation</span><FileText size={16} /></div><div className="metric-value">12</div><div className="metric-subtitle">New requests this week</div></div>
              <div className="metric-card card-orange"><div className="metric-header"><span className="metric-title">Pending Quotation</span><Clock size={16} /></div><div className="metric-value">3</div><div className="metric-subtitle">Awaiting approval</div></div>
              <div className="metric-card card-green"><div className="metric-header"><span className="metric-title">Approved Quotation</span><CheckCircle size={16} /></div><div className="metric-value">8</div><div className="metric-subtitle">Signed this month</div></div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title border-title">Order Confirmation</h2>
            <div className="grid-4-col">
              <div className="metric-card card-yellow"><div className="metric-header"><span className="metric-title">Order Confirmation</span><Archive size={16} /></div><div className="metric-value">0</div><div className="metric-subtitle">Documents & filing</div></div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title border-title">Sales Pipeline</h2>
            <div className="grid-4-col">
              <div className="metric-card card-orange"><div className="metric-header"><span className="metric-title">Sales Pipeline Value</span><FileArchive size={16} /></div><div className="metric-value">₹12.5L</div><div className="metric-subtitle">Active opportunities</div></div>
              <div className="metric-card card-yellow"><div className="metric-header"><span className="metric-title">Order Closed</span><Flame size={16} /></div><div className="metric-value">8</div><div className="metric-subtitle">+2 Closed Today</div></div>
              <div className="metric-card card-green"><div className="metric-header"><span className="metric-title">Order Confirmed</span><CheckCircle size={16} /></div><div className="metric-value">0</div><div className="metric-subtitle">Successfully closed</div></div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title border-title">Payment Collection</h2>
            <div className="grid-4-col">
              <div className="metric-card card-green"><div className="metric-header"><span className="metric-title">Total Collected</span><CheckCircle2 size={16} /></div><div className="metric-value">₹9.3L</div><div className="metric-subtitle">Amount received</div></div>
              <div className="metric-card card-blue"><div className="metric-header"><span className="metric-title">Upcoming Dues</span><Clock size={16} /></div><div className="metric-value">₹2.4L</div><div className="metric-subtitle">Due this month</div></div>
              <div className="metric-card card-orange"><div className="metric-header"><span className="metric-title">Pending Payments</span><AlertCircle size={16} /></div><div className="metric-value">₹8.5L</div><div className="metric-subtitle">Awaiting clearance</div></div>
              <div className="metric-card card-rose"><div className="metric-header"><span className="metric-title">Overdue Payments</span><XCircle size={16} /></div><div className="metric-value">₹32,500</div><div className="metric-subtitle">Past due date</div></div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
