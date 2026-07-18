import React, { useState } from 'react';
import { 
  Plus,
  ChevronDown,
  Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from '../components/DateRangePicker';
import './Orders.css';

const mockCoordinatorOrders = [
  {
    id: 'PF-1001',
    clientName: 'Sree Brindaavan Kindergarten',
    projectType: 'PU Sheet Roof with ...',
    location: 'Chitlapakkam',
    salesperson: 'Saleem Khan',
    value: '₹4,50,000'
  },
  {
    id: 'PF-1002',
    clientName: 'Acme Corp Warehouse',
    projectType: 'PEB Warehouse Stru...',
    location: 'Oragadam',
    salesperson: 'Rahul S.',
    value: '₹85,00,000'
  },
  {
    id: 'PF-1003',
    clientName: 'BlueSky Logistics',
    projectType: 'Cold Storage PEB',
    location: 'Sriperumbudur',
    salesperson: 'Karthik M.',
    value: '₹1,50,00,000'
  },
  {
    id: 'PF-1004',
    clientName: 'Green Valley School',
    projectType: 'Tensile Fabric Walkway',
    location: 'OMR, Chennai',
    salesperson: 'Divya R.',
    value: '₹2,50,000'
  },
  {
    id: 'PF-1005',
    clientName: 'NexGen Auto',
    projectType: 'Mezzanine Floor',
    location: 'Ambattur',
    salesperson: 'Saleem Khan',
    value: '₹12,00,000'
  },
  {
    id: 'PF-1006',
    clientName: 'Sunrise Textiles',
    projectType: 'Dyeing Unit Shed',
    location: 'Tiruppur',
    salesperson: 'Arun K.',
    value: '₹55,00,000'
  },
  {
    id: 'PF-1007',
    clientName: 'Royal Convention Center',
    projectType: 'Large Span PEB Hall',
    location: 'ECR',
    salesperson: 'Rahul S.',
    value: '₹2,10,00,000'
  },
  {
    id: 'PF-1008',
    clientName: 'Fresh Farms',
    projectType: 'Poultry Farm Shed',
    location: 'Hosur',
    salesperson: 'Karthik M.',
    value: '₹32,00,000'
  },
  {
    id: 'PF-1009',
    clientName: 'Metro Builders',
    projectType: 'Site Office Porta Cabin',
    location: 'Guindy',
    salesperson: 'Divya R.',
    value: '₹8,50,000'
  },
  {
    id: 'PF-1010',
    clientName: 'TechPark Alpha',
    projectType: 'Car Parking Tensile S...',
    location: 'Navalur',
    salesperson: 'Saleem Khan',
    value: '₹18,00,000'
  }
];

const mockManagerOrders = [
  {
    id: 'PF-1001',
    clientName: 'Arjun Mehta',
    projectType: 'Residential Roofing',
    location: 'New Delhi',
    salesperson: 'Mike Johnson',
    value: '₹12,00,000'
  }
];

export default function Orders() {
  const [viewMode, setViewMode] = useState('manager');
  const navigate = useNavigate();

  return (
    <div className="orders-page">
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

      <div className="orders-header">
        <div>
          <h1>Order Confirmation</h1>
          <p className="header-subtitle text-muted">Manage all sales to project handovers.</p>
        </div>
        <button className="btn btn--primary btn-icon" onClick={() => navigate('/orders/new')}>
          <Plus size={18} />
          New Handover Form
        </button>
      </div>

      <div className="orders-filters">
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

      <div className="orders-table-container">
        {viewMode === 'manager' ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>File ID</th>
                <th>Client Name</th>
                <th>Project Type</th>
                <th>Location</th>
                <th>Salesperson</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockManagerOrders.map(order => (
                <tr key={order.id}>
                  <td className="fw-600 text-file-id-blue">{order.id}</td>
                  <td className="fw-700">{order.clientName}</td>
                  <td className="text-muted">{order.projectType}</td>
                  <td className="text-muted">{order.location}</td>
                  <td className="text-muted">{order.salesperson}</td>
                  <td className="fw-700 text-success-bright">{order.value}</td>
                  <td>
                    <button className="btn-circle-edit" title="Edit">
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Lead id</th>
                <th>Client name</th>
                <th>Project type</th>
                <th>Location</th>
                <th>Salesperson</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCoordinatorOrders.map(order => (
                <tr key={order.id}>
                  <td className="fw-600" style={{color: '#334155'}}>{order.id}</td>
                  <td className="fw-700">{order.clientName}</td>
                  <td className="text-muted">{order.projectType}</td>
                  <td className="text-muted">{order.location}</td>
                  <td className="text-muted">{order.salesperson}</td>
                  <td className="fw-700 text-success-bright">{order.value}</td>
                  <td>
                    <button className="btn-circle-edit" title="Edit">
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
