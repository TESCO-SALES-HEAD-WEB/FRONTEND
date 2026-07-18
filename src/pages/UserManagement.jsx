import React, { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical, UploadCloud, CheckCircle, Copy, AlertCircle, X } from 'lucide-react';
import './UserManagement.css';

const mockUsers = [
  { id: 'MGR-0012', name: 'Priya Sharma', email: 'priya@company.com', role: 'Sales Manager', team: 'North', status: 'Active', lastActive: '2 hours ago' },
  { id: 'CRD-0045', name: 'Rahul Kumar', email: 'rahul@company.com', role: 'Coordinator', team: 'North', status: 'Active', lastActive: '5 mins ago', reportsTo: 'Priya Sharma' },
  { id: 'MGR-0013', name: 'Amit Patel', email: 'amit@company.com', role: 'Sales Manager', team: 'West', status: 'Pending', lastActive: 'Never' },
];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [selectedRole, setSelectedRole] = useState('manager');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', empId: 'MGR-0014', dateJoined: '',
    region: '', teamName: '', target: '', reportsTo: '',
    passwordMode: 'invite'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({ 
      ...prev, 
      empId: role === 'manager' ? 'MGR-0014' : 'CRD-0046'
    }));
  };

  const handleNext = () => {
    if (wizardStep < 4) setWizardStep(wizardStep + 1);
    else setIsSuccess(true);
  };

  const resetWizard = () => {
    setIsSuccess(false);
    setWizardStep(1);
    setFormData({
      name: '', email: '', phone: '', empId: 'MGR-0014', dateJoined: '',
      region: '', teamName: '', target: '', reportsTo: '',
      passwordMode: 'invite'
    });
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>User Management</h1>
        <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create ID
        </button>
      </div>

      <div className="users-tabs">
        {['All', 'Managers', 'Coordinators', 'Pending activation', 'Deactivated'].map(tab => (
          <button 
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="users-toolbar">
        <div className="search-box">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search by name, email, or ID..." />
        </div>
        <div className="toolbar-actions">
          <button className="btn btn--secondary"><Filter size={16} /> Status</button>
          <button className="btn btn--secondary"><Filter size={16} /> Team</button>
          <button className="btn btn--secondary"><Download size={16} /> Export</button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>User</th>
              <th>Employee ID</th>
              <th>Role</th>
              <th>Reports to</th>
              <th>Region/Team</th>
              <th>Status</th>
              <th>Last Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr 
                key={user.id} 
                className={`clickable-row ${selectedUser?.id === user.id ? 'selected-row' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <td onClick={(e) => e.stopPropagation()}><input type="checkbox" /></td>
                <td>
                  <div className="user-cell">
                    <div className="avatar-sm">{user.name.charAt(0)}</div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="mono text-muted">{user.id}</td>
                <td>
                  <span className={`role-badge ${user.role === 'Sales Manager' ? 'manager' : 'coordinator'}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.reportsTo || '—'}</td>
                <td>{user.team}</td>
                <td>
                  <span className={`status-pill ${user.status.toLowerCase()}`}>
                    <span className="dot"></span> {user.status}
                  </span>
                </td>
                <td className="text-muted text-xs">{user.lastActive}</td>
                <td>
                  <button className="btn btn--icon"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            {!isSuccess ? (
              <>
                <div className="modal-header">
                  <h2>Create User ID</h2>
                  <button className="btn btn--icon" onClick={() => setIsModalOpen(false)}>×</button>
                </div>
                
                <div className="wizard-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(wizardStep / 4) * 100}%` }}></div>
                  </div>
                  <div className="step-counter text-muted text-xs">Step {wizardStep} of 4</div>
                </div>

                <div className="modal-content scrollable">
                  {wizardStep === 1 && (
                    <div className="role-selection">
                      <div 
                        className={`role-card ${selectedRole === 'manager' ? 'active' : ''}`}
                        onClick={() => handleRoleSelect('manager')}
                      >
                        <div className={`role-icon ${selectedRole === 'manager' ? 'bg-primary' : ''}`}>SM</div>
                        <h3>Sales Manager</h3>
                        <p className="text-muted text-xs">Owns a team, approves coordinator work, raises requests to you.</p>
                      </div>
                      <div 
                        className={`role-card ${selectedRole === 'coordinator' ? 'active' : ''}`}
                        onClick={() => handleRoleSelect('coordinator')}
                      >
                        <div className={`role-icon ${selectedRole === 'coordinator' ? 'bg-primary' : ''}`}>SC</div>
                        <h3>Sales Coordinator</h3>
                        <p className="text-muted text-xs">Handles leads and follow-ups under a manager.</p>
                      </div>
                    </div>
                  )}

                  {wizardStep === 2 && (
                    <div className="form-grid">
                      <div className="form-group full-width upload-group">
                        <div className="upload-box">
                          <UploadCloud size={24} className="text-muted" />
                          <p className="text-sm">Drag & drop profile photo</p>
                          <p className="text-xs text-muted">or click to browse</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" placeholder="e.g. John Doe" />
                      </div>
                      <div className="form-group">
                        <label>Work Email *</label>
                        <div className="input-with-icon">
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="john@company.com" />
                          {formData.email && formData.email.includes('@') && <CheckCircle size={16} className="text-success validation-icon" />}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Phone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="+91 98765 43210" />
                      </div>
                      <div className="form-group">
                        <label>Employee ID *</label>
                        <input type="text" name="empId" value={formData.empId} onChange={handleInputChange} className="form-input mono" />
                      </div>
                      <div className="form-group">
                        <label>Date of Joining</label>
                        <input type="date" name="dateJoined" value={formData.dateJoined} onChange={handleInputChange} className="form-input" />
                      </div>
                    </div>
                  )}

                  {wizardStep === 3 && selectedRole === 'manager' && (
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Region / Territory *</label>
                        <select name="region" value={formData.region} onChange={handleInputChange} className="form-input">
                          <option value="">Select Region</option>
                          <option value="North">North</option>
                          <option value="South">South</option>
                          <option value="East">East</option>
                          <option value="West">West</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Team Name *</label>
                        <input type="text" name="teamName" value={formData.teamName} onChange={handleInputChange} className="form-input" placeholder="e.g. North Alpha" />
                      </div>
                      <div className="form-group full-width">
                        <label>Monthly Target (₹)</label>
                        <input type="number" name="target" value={formData.target} onChange={handleInputChange} className="form-input" placeholder="1000000" />
                      </div>
                      <div className="form-group full-width bg-light p-4 radius-sm">
                        <label>Assign Coordinators (Optional)</label>
                        <p className="text-xs text-muted mb-2">Select existing coordinators to move to this manager's team.</p>
                        <div className="checkbox-list">
                          <label className="checkbox-label"><input type="checkbox" /> Sneha Gupta (Currently unassigned)</label>
                          <label className="checkbox-label"><input type="checkbox" /> Raj Patel (Currently unassigned)</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {wizardStep === 3 && selectedRole === 'coordinator' && (
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label>Reports to (Manager) *</label>
                        <select name="reportsTo" value={formData.reportsTo} onChange={handleInputChange} className="form-input">
                          <option value="">Select Manager</option>
                          <option value="Priya Sharma">Priya Sharma (Team Size: 4)</option>
                          <option value="Amit Patel">Amit Patel (Team Size: 2)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Territory (Auto-filled from Manager)</label>
                        <input type="text" className="form-input bg-disabled" value={formData.reportsTo === 'Priya Sharma' ? 'North' : formData.reportsTo === 'Amit Patel' ? 'West' : ''} readOnly />
                      </div>
                      <div className="form-group">
                        <label>Monthly Target (₹)</label>
                        <input type="number" name="target" value={formData.target} onChange={handleInputChange} className="form-input" placeholder="500000" />
                      </div>
                    </div>
                  )}

                  {wizardStep === 4 && (
                    <div className="review-step">
                      <div className="summary-card mb-4">
                        <div className="summary-row">
                          <span className="text-muted">User:</span>
                          <span className="font-medium">{formData.name || 'Not provided'} ({formData.empId})</span>
                        </div>
                        <div className="summary-row">
                          <span className="text-muted">Role:</span>
                          <span>{selectedRole === 'manager' ? 'Sales Manager' : 'Sales Coordinator'}</span>
                        </div>
                        <div className="summary-row">
                          <span className="text-muted">Email:</span>
                          <span>{formData.email || 'Not provided'}</span>
                        </div>
                        {selectedRole === 'manager' ? (
                          <div className="summary-row">
                            <span className="text-muted">Region/Team:</span>
                            <span>{formData.region} / {formData.teamName}</span>
                          </div>
                        ) : (
                          <div className="summary-row">
                            <span className="text-muted">Reports to:</span>
                            <span>{formData.reportsTo}</span>
                          </div>
                        )}
                      </div>

                      <div className="permission-checklist mb-4">
                        <h4>Permissions (Template Defaults)</h4>
                        <div className="checkbox-grid">
                          <label className="checkbox-label"><input type="checkbox" defaultChecked /> Create Lead</label>
                          <label className="checkbox-label"><input type="checkbox" defaultChecked /> Edit Own Lead</label>
                          <label className="checkbox-label"><input type="checkbox" defaultChecked={selectedRole==='manager'} disabled={selectedRole==='coordinator'} /> View Team Reports</label>
                          <label className="checkbox-label"><input type="checkbox" defaultChecked={selectedRole==='manager'} disabled={selectedRole==='coordinator'} /> Approve Requests</label>
                        </div>
                      </div>

                      <div className="password-handling">
                        <h4>Password Setup</h4>
                        <div className="radio-group">
                          <label className="radio-label">
                            <input 
                              type="radio" 
                              name="passwordMode" 
                              value="invite" 
                              checked={formData.passwordMode === 'invite'} 
                              onChange={handleInputChange} 
                            />
                            Send invite email to set password
                          </label>
                          <label className="radio-label">
                            <input 
                              type="radio" 
                              name="passwordMode" 
                              value="temp" 
                              checked={formData.passwordMode === 'temp'} 
                              onChange={handleInputChange} 
                            />
                            Set temporary password
                          </label>
                        </div>
                        {formData.passwordMode === 'temp' && (
                          <div className="temp-password-box mt-3">
                            <input type="text" className="form-input mb-2" defaultValue="tempPass123!" />
                            <label className="checkbox-label text-xs">
                              <input type="checkbox" defaultChecked /> Force change on first login
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button 
                    className="btn btn--secondary" 
                    onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setIsModalOpen(false)}
                  >
                    {wizardStep === 1 ? 'Cancel' : 'Back'}
                  </button>
                  <button 
                    className="btn btn--primary" 
                    onClick={handleNext}
                  >
                    {wizardStep === 4 ? 'Create ID' : 'Next'}
                  </button>
                </div>
              </>
            ) : (
              <div className="success-state">
                <div className="success-icon-large">
                  <CheckCircle size={64} className="text-success" />
                </div>
                <h2>User ID Created!</h2>
                <p className="text-muted mb-4">{formData.name} has been added as a {selectedRole === 'manager' ? 'Sales Manager' : 'Sales Coordinator'}.</p>
                
                <div className="credential-summary">
                  <div className="cred-row">
                    <span className="text-muted text-sm">Employee ID</span>
                    <div className="copyable">
                      <span className="mono font-medium">{formData.empId}</span>
                      <button className="btn--icon"><Copy size={14} /></button>
                    </div>
                  </div>
                  {formData.passwordMode === 'temp' && (
                    <div className="cred-row">
                      <span className="text-muted text-sm">Temp Password</span>
                      <div className="copyable">
                        <span className="mono font-medium">tempPass123!</span>
                        <button className="btn--icon"><Copy size={14} /></button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer success-footer">
                  <button className="btn btn--secondary" onClick={resetWizard}>Create Another</button>
                  <button className="btn btn--primary" onClick={() => setIsModalOpen(false)}>Done</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="drawer-overlay" onClick={() => setSelectedUser(null)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="detail-content">
              <div className="detail-header">
                <div>
                  <div className="detail-id">{selectedUser.id}</div>
                  <h2 className="detail-title">{selectedUser.name}</h2>
                </div>
                <div className="drawer-close">
                  <button className="btn--icon" onClick={() => setSelectedUser(null)}><X size={20}/></button>
                </div>
              </div>

              <div className="summary-grid">
                <div className="summary-item">
                  <label>Role</label>
                  <div>
                    <span className={`role-badge ${selectedUser.role === 'Sales Manager' ? 'manager' : 'coordinator'}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
                <div className="summary-item">
                  <label>Status</label>
                  <div>
                    <span className={`status-pill ${selectedUser.status.toLowerCase()}`}>
                      <span className="dot"></span> {selectedUser.status}
                    </span>
                  </div>
                </div>
                <div className="summary-item">
                  <label>Email</label>
                  <div>{selectedUser.email}</div>
                </div>
                <div className="summary-item">
                  <label>Region / Team</label>
                  <div>{selectedUser.team}</div>
                </div>
                {selectedUser.reportsTo && (
                  <div className="summary-item full-width">
                    <label>Reports to</label>
                    <div className="font-medium">{selectedUser.reportsTo}</div>
                  </div>
                )}
                <div className="summary-item full-width">
                  <label>Last Active</label>
                  <div className="text-muted">{selectedUser.lastActive}</div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Permissions</h3>
                <div className="checkbox-grid mt-3">
                  <label className="checkbox-label"><input type="checkbox" defaultChecked disabled /> Create Lead</label>
                  <label className="checkbox-label"><input type="checkbox" defaultChecked disabled /> Edit Own Lead</label>
                  <label className="checkbox-label"><input type="checkbox" defaultChecked={selectedUser.role === 'Sales Manager'} disabled /> View Team Reports</label>
                  <label className="checkbox-label"><input type="checkbox" defaultChecked={selectedUser.role === 'Sales Manager'} disabled /> Approve Requests</label>
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <button className="btn ghost-danger">Deactivate</button>
              <button className="btn btn--secondary">Reset Password</button>
              <button className="btn btn--primary">Edit User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
