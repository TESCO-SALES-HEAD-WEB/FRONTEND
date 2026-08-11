import React, { useState, useEffect } from 'react';
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
import ScopeFilter from '../components/ScopeFilter';
import CreateVisitModal from '../components/CreateVisitModal';
import ScheduleVisitModal from '../components/ScheduleVisitModal';
import StartAppointmentModal from '../components/StartAppointmentModal';
import RescheduleAppointmentModal from '../components/RescheduleAppointmentModal';
import { api } from '../api/client';
import { useViewMode } from '../context/ViewModeContext';
import './Appointments.css';

const statusColorMap = {
  waiting: 'yellow',
  assigned: 'green',
  completed: 'blue',
  rescheduled: 'orange',
};

const getStatusColor = (status) => statusColorMap[String(status || '').toLowerCase()] || 'gray';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr).toUpperCase();
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  return `${day} ${month} ${d.getFullYear()}`;
};

const formatTime = (apt) => {
  const start = apt.timeStart || '';
  const end = apt.timeEnd || '';
  if (start && end) return `${start} - ${end}`;
  return apt.time || start || end || apt.startTime || '';
};

const formatDateTime = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  return dt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};

// Was this record created by its OWN assigned manager (vs assigned by a coordinator)?
const isSelfCreated = (apt) => {
  const c = String(apt.createdBy || '').trim().toLowerCase();
  const m = String(apt.manager || '').trim().toLowerCase();
  return !!c && !!m && c === m;
};
// A record belongs in the VISIT section if it's a site visit OR it was NOT self-created by
// its assigned manager (i.e. a coordinator-assigned appointment) — matching the Manager
// app's inVisitSection rule so both apps classify records the same way.
const isVisit = (apt) => {
  const t = String(apt.type || '').toLowerCase();
  const vt = String(apt.visitType || '').toLowerCase();
  return t === 'site visit' || t === 'visits' || t === 'visit' || vt.includes('visit') || !isSelfCreated(apt);
};
const isAppointment = (apt) => !isVisit(apt);

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('appointment');
    const { view: viewMode, setView: setViewMode, manager, setManager } = useViewMode();
  const [isCreateVisitModalOpen, setIsCreateVisitModalOpen] = useState(false);
  const [isScheduleVisitModalOpen, setIsScheduleVisitModalOpen] = useState(false);
  const [isStartAptModalOpen, setIsStartAptModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [activeApt, setActiveApt] = useState(null); // record targeted by the Start/Reschedule modal

  const loadAppointments = async () => {
    try {
      const data = await api('/appointments');
      // Cancelled appointments are kept in the DB (for the manager's notification) but
      // should not appear as active in the Head overview.
      setAppointments(Array.isArray(data) ? data.filter(a => a.status !== 'Cancelled' && !a.cancelledAt) : []);
    } catch {
      setAppointments([]);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      await loadAppointments();
      try {
        const mgrs = await api('/auth/managers');
        if (active) setManagers(Array.isArray(mgrs) ? mgrs : []);
      } catch {
        if (active) setManagers([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Match the real apps: an item is done if status/progressStatus says completed, or it was stamped completedAt
  const isCompleted = (apt) => String(apt.status || '').toLowerCase().includes('complet') || String(apt.progressStatus || '').toLowerCase() === 'completed' || !!apt.completedAt;

  // Manager View scopes to the selected manager; Coordinator View is org-wide
  const scopeMgr = viewMode === 'manager' ? manager : 'all';
  const managerFiltered = appointments.filter(apt => scopeMgr === 'all' || apt.manager === scopeMgr);

  const totalAppointments = managerFiltered.filter(isAppointment).length;
  const totalVisitsPlanned = managerFiltered.filter(isVisit).length;
  const completedAppointments = managerFiltered.filter(a => isAppointment(a) && isCompleted(a)).length;
  const completedVisits = managerFiltered.filter(a => isVisit(a) && isCompleted(a)).length;

  const visibleAppointments = managerFiltered.filter(apt => {
    const matchesTab = (viewMode !== 'coordinator' && activeTab === 'visits') ? isVisit(apt) : isAppointment(apt);
    return matchesTab;
  });

  const renderManagerMetrics = () => (
    <div className="appointments-metrics">
      <div className="metric-card card-blue">
        <div className="metric-header">
          <span className="metric-title text-muted">Total Appointments</span>
          <CalendarDays size={18} className="metric-icon" />
        </div>
        <div className="metric-value">{totalAppointments}</div>
        <div className="metric-subtitle text-muted">Scheduled this month</div>
      </div>
      <div className="metric-card card-purple">
        <div className="metric-header">
          <span className="metric-title text-muted">Total Visit Planned</span>
          <MapPinOutline size={18} className="metric-icon" />
        </div>
        <div className="metric-value">{totalVisitsPlanned}</div>
        <div className="metric-subtitle text-muted">Planned site visits</div>
      </div>
      <div className="metric-card card-green">
        <div className="metric-header">
          <span className="metric-title text-muted">Completed Appointments</span>
          <CheckCircle2 size={18} className="metric-icon" />
        </div>
        <div className="metric-value">{completedAppointments}</div>
        <div className="metric-subtitle text-muted">Completed appointments</div>
      </div>
      <div className="metric-card card-orange">
        <div className="metric-header">
          <span className="metric-title text-muted">Total Visit Completed</span>
          <CheckCircle2 size={18} className="metric-icon" />
        </div>
        <div className="metric-value">{completedVisits}</div>
        <div className="metric-subtitle text-muted">Site visits completed</div>
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
        <div className="metric-value">{totalAppointments}</div>
        <div className="metric-subtitle text-muted">All scheduled appointments</div>
      </div>
      <div className="metric-card card-green">
        <div className="metric-header">
          <span className="metric-title text-muted">Completed Appointments</span>
          <CheckCircle2 size={18} className="metric-icon" />
        </div>
        <div className="metric-value">{completedAppointments}</div>
        <div className="metric-subtitle text-muted">Successfully completed</div>
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
              <ScopeFilter />
            </div>
          </div>

          <div className="appointments-list">
            {visibleAppointments.length === 0 ? (
              <div className="text-muted" style={{ padding: '1rem' }}>No appointments found.</div>
            ) : visibleAppointments.map((apt, i) => (
              <div key={apt._id || apt.id || i} className="appointment-card manager-apt-card">
                  <div className="apt-datetime">
                    <span className="apt-date">{formatDate(apt.date)}</span>
                    <span className="apt-time">{formatTime(apt)}</span>
                  </div>
                  <div className="apt-details">
                    <div className="apt-title-row">
                      <h3 className="apt-title">{apt.title}</h3>
                      <span className={`apt-badge badge-${getStatusColor(isCompleted(apt) ? 'completed' : apt.status)}`}>
                        {isCompleted(apt) ? 'COMPLETED' : String(apt.status || '').toUpperCase()}
                      </span>
                    </div>
                    <div className="apt-meta manager-apt-meta">
                      <div className="meta-item text-muted">
                        <User size={14} />
                        {apt.manager}
                      </div>
                      <div className="meta-item text-muted">
                        <Phone size={14} />
                        {apt.phone}
                      </div>
                      <div className="meta-item text-muted">
                        <MapPin size={14} />
                        {apt.location || apt.googleLocation || '—'}
                      </div>
                    </div>

                    {/* Reschedule information */}
                    {apt.rescheduledAt && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                        <strong style={{ color: '#B45309' }}>Rescheduled</strong>{apt.rescheduledBy ? ` by ${apt.rescheduledBy}` : ''}
                        {apt.rescheduleStatus ? ` · ${apt.rescheduleStatus}` : ''} → {formatDate(apt.date)} {formatTime(apt)}
                        {Array.isArray(apt.rescheduleHistory) && apt.rescheduleHistory.length > 0 && apt.rescheduleHistory[apt.rescheduleHistory.length - 1]?.reason && (
                          <div style={{ marginTop: '0.15rem' }}>Reason: {apt.rescheduleHistory[apt.rescheduleHistory.length - 1].reason}</div>
                        )}
                      </div>
                    )}

                    {/* Manager-entered visit details */}
                    {(apt.startTime || apt.completedAt || apt.measurementNote || apt.meetingRemarks || (apt.designRequest && apt.designRequest !== 'None')) && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        {apt.startTime && <div><span className="text-muted">Start time:</span> {apt.startTime}</div>}
                        {apt.completedAt && <div><span className="text-muted">Completed:</span> {formatDateTime(apt.completedAt)}{apt.completedBy ? ` by ${apt.completedBy}` : ''}</div>}
                        {apt.measurementNote && <div><span className="text-muted">Measurement:</span> {apt.measurementNote} Sq.ft</div>}
                        {apt.meetingRemarks && <div><span className="text-muted">Remarks:</span> {apt.meetingRemarks}</div>}
                        {apt.designRequest && apt.designRequest !== 'None' && <div><span className="text-muted">Design request:</span> {apt.designRequest}</div>}
                        {(apt.siteImage || apt.measurementImage) && (
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                            {apt.siteImage && <a href={apt.siteImage} target="_blank" rel="noopener noreferrer" style={{ color: '#4F46E5' }}>Site image</a>}
                            {apt.measurementImage && <a href={apt.measurementImage} target="_blank" rel="noopener noreferrer" style={{ color: '#4F46E5' }}>Measurement image</a>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="apt-actions-stacked">
                    <button className="btn btn--outline" onClick={() => { setActiveApt(apt); setIsRescheduleModalOpen(true); }}>Reschedule</button>
                    {!isCompleted(apt) && (
                      <button
                        className="btn btn--primary"
                        style={{marginTop: '0.5rem', width: '100%'}}
                        onClick={() => { setActiveApt(apt); setIsStartAptModalOpen(true); }}
                      >
                        {isVisit(apt) ? 'Start Visit' : 'Start Appointment'}
                      </button>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="appointments-filters">
            {/* Coordinator View shows appointments only — visits are manager-side, so no Visits tab. */}
            <div className="tab-toggle">
              <button
                className={`tab-btn ${activeTab === 'appointment' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointment')}
              >
                Appointment
              </button>
            </div>

            <div className="filter-controls">
              <DateRangePicker />
              <ScopeFilter />
            </div>
          </div>

          <div className="appointments-list">
            {visibleAppointments.length === 0 ? (
              <div className="text-muted" style={{ padding: '1rem' }}>No appointments found.</div>
            ) : visibleAppointments.map((apt, i) => (
              <div key={apt._id || apt.id || i} className="appointment-card">
                <div className="apt-datetime">
                  <span className="apt-date">{formatDate(apt.date)}</span>
                  <span className="apt-time text-muted">{formatTime(apt)}</span>
                </div>
                <div className="apt-details">
                  <div className="apt-title-row">
                    <h3 className="apt-title">{apt.title}</h3>
                    <span className={`apt-badge badge-${getStatusColor(apt.status)}`}>
                      {String(apt.status || '').toUpperCase()}
                    </span>
                  </div>
                  <div className="apt-meta">
                    <div className="meta-item text-muted">
                      <User size={14} />
                      {apt.manager}
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
                  <button className="btn btn--outline" onClick={() => { setActiveApt(apt); setIsRescheduleModalOpen(true); }}>Reschedule</button>
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
        onCreated={loadAppointments}
      />
      <StartAppointmentModal
        isOpen={isStartAptModalOpen}
        appointment={activeApt}
        onClose={() => { setIsStartAptModalOpen(false); setActiveApt(null); }}
        onSaved={loadAppointments}
      />
      <RescheduleAppointmentModal
        isOpen={isRescheduleModalOpen}
        appointment={activeApt}
        onClose={() => { setIsRescheduleModalOpen(false); setActiveApt(null); }}
        onSaved={loadAppointments}
      />
    </div>
  );
}
