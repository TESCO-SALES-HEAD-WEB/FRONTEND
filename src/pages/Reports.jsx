import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Download, Calendar, Filter, Mail } from 'lucide-react';
import './Reports.css';

const revData = [
  { name: 'Jan', actual: 12, target: 15 },
  { name: 'Feb', actual: 25, target: 28 },
  { name: 'Mar', actual: 42, target: 40 },
  { name: 'Apr', actual: 55, target: 55 },
  { name: 'May', actual: 68, target: 70 },
  { name: 'Jun', actual: 85, target: 82 }
];

const teamData = [
  { name: 'Priya', revenue: 45, target: 40 },
  { name: 'Rahul', revenue: 30, target: 35 },
  { name: 'Amit', revenue: 20, target: 20 },
  { name: 'Sneha', revenue: 25, target: 30 }
];

const approvalPie = [
  { name: 'Discount', value: 45 },
  { name: 'Target', value: 25 },
  { name: 'Reassignment', value: 30 }
];
const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

export default function Reports() {
  return (
    <div className="reports-container">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <div className="reports-actions">
          <button className="btn btn--secondary"><Mail size={16}/> Schedule</button>
          <button className="btn btn--secondary"><Download size={16}/> Export PDF</button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-item">Preset: YTD <Filter size={14}/></div>
        <div className="filter-item">Manager <Filter size={14}/></div>
        <div className="filter-item">Territory <Filter size={14}/></div>
        <div className="filter-item"><input type="checkbox"/> Compare to previous</div>
      </div>

      <div className="reports-grid">
        <div className="report-card full-width">
          <div className="report-header">
            <h2>Revenue: Actual vs Target (Cumulative)</h2>
          </div>
          <div className="chart-container-large">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="target" stroke="var(--border)" fill="transparent" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="actual" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-card">
          <div className="report-header">
            <h2>Team Comparison</h2>
          </div>
          <div className="chart-container-large">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={teamData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}}/>
                <Legend />
                <Bar dataKey="target" fill="var(--border)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-card">
          <div className="report-header">
            <h2>Approval Breakdown</h2>
          </div>
          <div className="chart-container-large" style={{ display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={approvalPie} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {approvalPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
