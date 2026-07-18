import React, { useState } from 'react';
import { 
  CalendarDays, 
  CalendarCheck2, 
  CheckCircle2, 
  Flag,
  User,
  Phone,
  MapPin,
  ChevronDown,
  Plus,
  MapPin as MapPinOutline,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import DateRangePicker from '../components/DateRangePicker';
import CreateVisitModal from '../components/CreateVisitModal';
import ScheduleVisitModal from '../components/ScheduleVisitModal';
import StartAppointmentModal from '../components/StartAppointmentModal';
import RescheduleAppointmentModal from '../components/RescheduleAppointmentModal';
import './Appointments.css';

const mockCoordinatorAppointments = [
  {
    id: 'APT-1',
    date: '08 JUL 2026',
    time: '10:00 AM - 11:00 AM',
    title: 'Site Inspection - Alpha Towers',
    status: 'WAITING',
    statusColor: 'yellow',
    person: 'Sarah Smith',
    phone: '9876543210',
    location: 'Downtown'
  },
  {
    id: 'APT-2',
    date: '09 JUL 2026',
    time: '02:00 PM - 03:30 PM',
    title: 'Client Meeting - Tech Park',
    status: 'ASSIGNED',
    statusColor: 'green',
    person: 'John Doe',
    phone: '9876543211',
    location: 'Tech Park, North Block'
  },
  {
    id: 'APT-3',
    date: '07 JUL 2026',
    time: '04:00 PM - 05:00 PM',
    title: 'Final Handover - Villa 34',
    status: 'COMPLETED',
    statusColor: 'blue',
    person: 'Emma Stone',
    phone: '9876543212',
    location: 'Sunny Heights'
  }
];

const mockManagerAppointments = [
  {
    id: 'M-APT-1',
    date: '20 MAY 2026',
    time: '04:00 PM - 05:00 PM',
    title: 'Initial Consultation',
    status: 'WAITING',
    statusColor: 'yellow',
    person: 'Priya Sharma',
    phone: '+91 87654 32109',
    location: 'Main Office'
  },
  {
    id: 'M-APT-2',
    date: '21 MAY 2026',
    time: '11:00 AM - 12:30 PM',
    title: 'Design Finalization',
    status: 'ASSIGNED',
    statusColor: 'green',
    person: 'Rahul Gupta',
    phone: '+91 76543 21098',
    location: 'Virtual'
  }
];

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('appointment');
  const [viewMode, setViewMode] = useState('manager');
  const [isCreateVisitModalOpen, setIsCreateVisitModalOpen] = useState(false);
  const [isScheduleVisitModalOpen, setIsScheduleVisitModalOpen] = useState(false);
  const [isStartAptModalOpen, setIsStartAptModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  const renderManagerMetrics = () => (
    <div className="appointments-metrics">
      <div className="metric-card card-blue">
        <div className="metric-header">
          <span className="metric-title text-muted">Total Appointments</span>
          <CalendarDays size={18} className="metric-icon" />
        </div>
        <div className="metric-value">42</div>
        <div className="metric-subtitle text-muted">Scheduled this month</div>
      </div>
      <div className="metric-card card-purple">
        <div className="metric-header">
          <span className="metric-title text-muted">Total Visit Planned</span>
          <MapPinOutline size={18} className="metric-icon" />
        </div>
        <div className="metric-value">18</div>
        <div className="metric-subtitle text-muted">Planned site visits</div>
      </div>
      <div className="metric-card card-green">
        <div className="metric-header">
          <span className="metric-title text-muted">Completed Appointments</span>
          <CheckCircle2 size={18} className="metric-icon" />
        </div>
        <div className="metric-value">28</div>
        <div className="metric-subtitle text-muted">+5 Completed Today</div>
      </div>
      <div className="metric-card card-orange">
        <div className="metric-header">
          <span className="metric-title text-muted">Total Visit Completed</span>
          <CheckCircle2 size={18} className="metric-icon" />
        </div>
        <div className="metric-value">12</div>
        <div className="metric-subtitle text-muted">Done this week</div>
      </div>
    </div>
  );

  const renderCoordinatorMetrics = () => (
    <div className="appointments-metrics">
      <div className="metric-card card-blue">
        <div className="metric-header">
          <span className="metric-title text-muted">Total Appointments</span>
          <CalendarDays size={18} className="metric-icon" />
        </div>
        <div className="metric-value">10</div>
        <div className="metric-subtitle text-muted">All scheduled appointments</div>
      </div>
      <div className="metric-card card-cyan">
        <div className="metric-header">
          <span className="metric-title text-muted">Total Visit Planned</span>
          <CalendarCheck2 size={18} className="metric-icon" />
        </div>
        <div className="metric-value">8</div>
        <div className="metric-subtitle text-muted">Upcoming & pending visits</div>
      </div>
      <div className="metric-card card-green">
        <div className="metric-header">
          <span className="metric-title text-muted">Completed Appointments</span>
          <CheckCircle2 size={18} className="metric-icon" />
        </div>
        <div className="metric-value">2</div>
        <div className="metric-subtitle text-muted">Successfully completed</div>
      </div>
      <div className="metric-card card-orange">
        <div className="metric-header">
          <span className="metric-title text-muted">Total Visit Complete</span>
          <Flag size={18} className="metric-icon" />
        </div>
        <div className="metric-value">1</div>
        <div className="metric-subtitle text-muted">Site visits wrapped up</div>
      </div>
    </div>
  );

  return (
    <div className="appointments-page">
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

      <div className="appointments-header">
        <div>
          <h1>{viewMode === 'manager' ? 'Appointments & Visits' : 'Appointments & Site Visits'}</h1>
          {viewMode === 'manager' && <p className="header-subtitle text-muted" style={{marginTop: '0.25rem', fontSize: '0.875rem'}}>Manage your schedule and upcoming client meetings</p>}
        </div>
        {viewMode === 'manager' ? (
          <button className="btn btn--primary btn-icon" onClick={() => setIsCreateVisitModalOpen(true)}>
            <Plus size={18} />
            Create Visit Plan
          </button>
        ) : (
          <button className="btn btn--primary btn-icon" onClick={() => setIsScheduleVisitModalOpen(true)}>
            <CalendarDays size={18} />
            Schedule Visit
          </button>
        )}
      </div>

      {viewMode === 'manager' ? renderManagerMetrics() : renderCoordinatorMetrics()}

      {viewMode === 'manager' ? (
        <>
          <div className="appointments-filters" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
            <div className="manager-tab-toggle">
              <button 
                className={`manager-tab-btn ${activeTab === 'appointment' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointment')}
              >
                Appointment
              </button>
              <button 
                className={`manager-tab-btn ${activeTab === 'visits' ? 'active' : ''}`}
                onClick={() => setActiveTab('visits')}
              >
                Visits
              </button>
            </div>
            <div className="filter-controls" style={{ marginBottom: '1rem' }}>
              <DateRangePicker />
              <div className="custom-select-wrapper">
                <select className="btn btn--secondary filter-dropdown filter-select">
                  <option value="all">All Managers</option>
                  <option value="priya">Priya Sharma</option>
                  <option value="amit">Amit Patel</option>
                </select>
                <ChevronDown size={14} className="text-muted select-icon" />
              </div>
            </div>
          </div>

          <div className="appointments-list">
            {mockManagerAppointments.map(apt => (
              <div key={apt.id} className="appointment-card manager-apt-card">
                  <div className="apt-datetime">
                    <span className="apt-date">{apt.date}</span>
                    <span className="apt-time">{apt.time}</span>
                  </div>
                  <div className="apt-details">
                    <div className="apt-title-row">
                      <h3 className="apt-title">{apt.title}</h3>
                      <span className={`apt-badge badge-${apt.statusColor}`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="apt-meta manager-apt-meta">
                      <div className="meta-item text-muted">
                        <User size={14} />
                        {apt.person}
                      </div>
                      <div className="meta-item text-muted">
                        <Phone size={14} />
                        {apt.phone}
                      </div>
                      <div className="meta-item text-muted">
                        <MapPin size={14} />
                        {apt.location}
                      </div>
                    </div>
                  </div>
                  <div className="apt-actions-stacked">
                    <button className="btn btn--outline" onClick={() => setIsRescheduleModalOpen(true)}>Reschedule</button>
                    <button 
                      className="btn btn--primary" 
                      style={{marginTop: '0.5rem', width: '100%'}}
                      onClick={() => setIsStartAptModalOpen(true)}
                    >
                      Appointment Start
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="appointments-filters">
            <div className="tab-toggle">
              <button 
                className={`tab-btn ${activeTab === 'appointment' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointment')}
              >
                Appointment
              </button>
              <button 
                className={`tab-btn ${activeTab === 'visits' ? 'active' : ''}`}
                onClick={() => setActiveTab('visits')}
              >
                Visits
              </button>
            </div>

            <div className="filter-controls">
              <DateRangePicker />
              <div className="custom-select-wrapper">
                <select className="btn btn--secondary filter-dropdown filter-select">
                  <option value="all">All Coordinators</option>
                  <option value="rahul">Rahul Kumar</option>
                  <option value="sneha">Sneha Gupta</option>
                </select>
                <ChevronDown size={14} className="text-muted select-icon" />
              </div>
            </div>
          </div>

          <div className="appointments-list">
            {mockCoordinatorAppointments.map(apt => (
              <div key={apt.id} className="appointment-card">
                <div className="apt-datetime">
                  <span className="apt-date">{apt.date}</span>
                  <span className="apt-time text-muted">{apt.time}</span>
                </div>
                <div className="apt-details">
                  <div className="apt-title-row">
                    <h3 className="apt-title">{apt.title}</h3>
                    <span className={`apt-badge badge-${apt.statusColor}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="apt-meta">
                    <div className="meta-item text-muted">
                      <User size={14} />
                      {apt.person}
                    </div>
                    <div className="meta-item text-muted">
                      <Phone size={14} />
                      {apt.phone}
                    </div>
                    <div className="meta-item text-muted">
                      <MapPin size={14} />
                      {apt.location}
                    </div>
                  </div>
                </div>
                <div className="apt-actions">
                  <button className="btn btn--outline" onClick={() => setIsRescheduleModalOpen(true)}>Reschedule</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <CreateVisitModal 
        isOpen={isCreateVisitModalOpen}
        onClose={() => setIsCreateVisitModalOpen(false)}
      />
      <ScheduleVisitModal 
        isOpen={isScheduleVisitModalOpen}
        onClose={() => setIsScheduleVisitModalOpen(false)}
      />
      <StartAppointmentModal 
        isOpen={isStartAptModalOpen}
        onClose={() => setIsStartAptModalOpen(false)}
      />
      <RescheduleAppointmentModal 
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
      />
    </div>
  );
}
