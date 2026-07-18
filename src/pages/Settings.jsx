import React, { useState } from 'react';
import { Save, Plus, GripVertical, Trash2 } from 'lucide-react';
import './Settings.css';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Approval Rules');
  
  const tabs = ['Approval Rules', 'Roles & Permissions', 'ID Format', 'Notifications', 'Organization', 'Security'];

  return (
    <div className="settings-container">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-layout">
        <div className="settings-nav">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`settings-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="settings-content">
          <div className="settings-header">
            <h2>{activeTab}</h2>
            <button className="btn btn--primary"><Save size={16}/> Save Changes</button>
          </div>

          {activeTab === 'Approval Rules' && (
            <div className="settings-section">
              <p className="text-muted mb-4">Define auto-approval thresholds and escalation SLAs.</p>
              
              <div className="rule-builder">
                <div className="rule-row">
                  <GripVertical size={16} className="text-muted cursor-grab" />
                  <div className="rule-content">
                    <span>If</span>
                    <select className="form-input select-sm"><option>Discount</option></select>
                    <span>&gt;</span>
                    <input type="number" className="form-input input-sm" defaultValue={15} />
                    <span>% → requires</span>
                    <select className="form-input select-sm"><option>Sales Head</option></select>
                    <span>approval</span>
                  </div>
                  <button className="btn--icon text-danger"><Trash2 size={16}/></button>
                </div>
                
                <div className="rule-row">
                  <GripVertical size={16} className="text-muted cursor-grab" />
                  <div className="rule-content">
                    <span>If</span>
                    <select className="form-input select-sm"><option>Target change</option></select>
                    <span>&gt;</span>
                    <input type="number" className="form-input input-sm" defaultValue={10} />
                    <span>% → requires</span>
                    <select className="form-input select-sm"><option>Sales Head</option></select>
                    <span>approval</span>
                  </div>
                  <button className="btn--icon text-danger"><Trash2 size={16}/></button>
                </div>

                <button className="btn btn--secondary mt-3"><Plus size={16}/> Add Rule</button>
              </div>

              <div className="settings-group mt-4 pt-4 border-top">
                <h3>Global Policies</h3>
                <div className="policy-row mt-3">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Auto-approve requests below all thresholds</span>
                  </label>
                </div>
                <div className="policy-row mt-3 flex-align">
                  <span>Escalate pending requests after</span>
                  <input type="number" className="form-input input-sm" defaultValue={48} />
                  <span>hours</span>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Approval Rules' && (
            <div className="settings-section">
              <p className="text-muted">Placeholder for {activeTab} settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
