import React from 'react';
import { X, Hexagon } from 'lucide-react';
import './GenerateQuotationModal.css';

export default function GenerateQuotationModal({ isOpen, onClose, lead }) {
  if (!isOpen) return null;

  return (
    <div className="gqm-overlay" onClick={onClose}>
      <div className="gqm-container" onClick={e => e.stopPropagation()}>
        <div className="gqm-header">
          <div className="gqm-title-area">
            <h2>Generate Structural Quotation PDF</h2>
            <div className="gqm-subtitle">Format reference: assets/quotation-formats.pdf</div>
          </div>
          <button className="gqm-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="gqm-body">
          {/* PAGE 1 */}
          <div className="gqm-page">
            <div className="gqm-page-header">
              <div className="gqm-logo-area">
                <img src="/TS_logo.png" alt="Tesco Structures" style={{ height: '40px' }} />
              </div>
              <div className="gqm-header-contact">
                tescostructures@gmail.com
              </div>
            </div>

            <div className="gqm-quote-meta">
              <div className="gqm-meta-item">
                <strong>Quote No:</strong> TS-Q-1001
              </div>
              <div className="gqm-meta-item">
                <strong>Date:</strong> {lead?.date || 'Jul 24, 2026'}
              </div>
              <div className="gqm-meta-item">
                <strong>Validity:</strong> 30 Days
              </div>
            </div>

            <div className="gqm-section">
              <h3 className="gqm-section-title">1. BASIC INFO</h3>
              <div className="gqm-grid-2">
                <div className="gqm-info-box">
                  <div className="gqm-box-title">CLIENT DETAILS</div>
                  <div className="gqm-info-row">
                    <strong>{lead?.name || 'Reference Lead'}</strong>
                  </div>
                  <div className="gqm-info-row">
                    <span>Billing Name:</span> {lead?.name || 'Reference Lead'}
                  </div>
                  <div className="gqm-info-row">
                    <span>GST:</span> Not Provided
                  </div>
                </div>
                <div className="gqm-info-box">
                  <div className="gqm-box-title">CONTACT INFO</div>
                  <div className="gqm-info-row">
                    <span>Mobile:</span> {lead?.phone || '+91 90000 00000'}
                  </div>
                  <div className="gqm-info-row">
                    <span>Alt. Mobile:</span> N/A
                  </div>
                  <div className="gqm-info-row">
                    <span>Email:</span> client@example.com
                  </div>
                </div>
                <div className="gqm-info-box">
                  <div className="gqm-box-title">LOCATION</div>
                  <div className="gqm-info-row">
                    <span>Site Location:</span> Chennai, TN
                  </div>
                  <div className="gqm-info-row">
                    <span>Site Address:</span> Not Provided
                  </div>
                  <div className="gqm-info-row">
                    <span>Billing Address:</span> Same as Site
                  </div>
                </div>
                <div className="gqm-info-box">
                  <div className="gqm-box-title">SALES REPRESENTATIVE</div>
                  <div className="gqm-info-row">
                    <strong>{lead?.assignTo || 'Unassigned'}</strong>
                  </div>
                  <div className="gqm-info-row">
                    <span>Tesco Structures Sales Division</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="gqm-section">
              <h3 className="gqm-section-title">2. PROJECT DETAILS</h3>
              <div className="gqm-details-grid">
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Segment Category</span>
                  <span className="gqm-detail-value">{lead?.services || 'PEB'}</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Work Type / Segment</span>
                  <span className="gqm-detail-value">New</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Structure Type</span>
                  <span className="gqm-detail-value">Clear Span</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Plot Dimensions</span>
                  <span className="gqm-detail-value">50' x 80'</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Roof Area / Size</span>
                  <span className="gqm-detail-value">4000 Sq.Ft</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Heights (Roof/Clearance/Eaves)</span>
                  <span className="gqm-detail-value">20' / 18' / 15'</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Roof Covering Sheeting</span>
                  <span className="gqm-detail-value">GI</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Site Condition / Soil Test</span>
                  <span className="gqm-detail-value">Flat / Not Done</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Insulation Work</span>
                  <span className="gqm-detail-value">Not Included</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Site Access (Road/Crane/40ft)</span>
                  <span className="gqm-detail-value">Yes / No / No</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Environment (Rural/Wind/Seaside)</span>
                  <span className="gqm-detail-value">- / - / No</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Working Space</span>
                  <span className="gqm-detail-value">Moderate</span>
                </div>
              </div>
            </div>

            <div className="gqm-page-footer">
              <span>www.tescostructures.com</span>
              <span>|</span>
              <span>+91 90032 28009</span>
              <span>|</span>
              <span>32, 10th St, Gandhi Nagar, Ashok Nagar, Chennai, Tamil Nadu 600083</span>
            </div>
          </div>

          {/* PAGE 2 */}
          <div className="gqm-page">
            <div className="gqm-page-header">
              <div className="gqm-logo-area">
                <img src="/TS_logo.png" alt="Tesco Structures" style={{ height: '40px' }} />
              </div>
              <div className="gqm-header-contact">
                tescostructures@gmail.com
              </div>
            </div>

            <div className="gqm-section">
              <h3 className="gqm-section-title">3. QUOTATIONS</h3>
              <div className="gqm-details-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Design Services</span>
                  <span className="gqm-detail-value">2D: No | 3D: No</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Transportation Scope</span>
                  <span className="gqm-detail-value">Excluded</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Scaffolding Scope</span>
                  <span className="gqm-detail-value">Excluded</span>
                </div>
              </div>

              <table className="gqm-table">
                <thead>
                  <tr>
                    <th>Description of Work</th>
                    <th style={{ textAlign: 'right' }}>Total Price (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="gqm-table-title">Design, Fabrication, Supply, and Erection work charges</div>
                      <div className="gqm-table-desc">Comprehensive design calculation, civil base retrofitting, structural framework, columns, rafters, primary/secondary purlins, bracing rods, roofing sheets, fasteners, and site erection.</div>
                    </td>
                    <td className="gqm-table-price">{lead?.value || '₹ 100k'}</td>
                  </tr>
                  <tr className="gqm-table-subtotal">
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#4b5563' }}>Subtotal</td>
                    <td className="gqm-table-price">{lead?.value || '₹ 100k'}</td>
                  </tr>
                  <tr className="gqm-table-grandtotal">
                    <td className="gqm-grandtotal-label">Grand Total (All-Inclusive):</td>
                    <td className="gqm-grandtotal-value">{lead?.value || '₹ 100k'}</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="gqm-box-title" style={{ marginTop: '2rem', marginBottom: '1rem' }}>PRICING & PAYMENT MILESTONES SCHEDULE</h4>
              <div className="gqm-milestones">
                <div className="gqm-milestone-row">
                  <span className="gqm-milestone-desc">1. Advance With Purchase Order (PO)</span>
                  <span className="gqm-milestone-pct">10%</span>
                </div>
                <div className="gqm-milestone-row">
                  <span className="gqm-milestone-desc">2. Dispatch / After Drawing Approval</span>
                  <span className="gqm-milestone-pct">20%</span>
                </div>
                <div className="gqm-milestone-row">
                  <span className="gqm-milestone-desc">3. Erection / After Structure Work Completion</span>
                  <span className="gqm-milestone-pct">40%</span>
                </div>
                <div className="gqm-milestone-row">
                  <span className="gqm-milestone-desc">4. Handover / After Completion Sign-off</span>
                  <span className="gqm-milestone-pct">30%</span>
                </div>
              </div>
            </div>

            <div className="gqm-section" style={{ marginTop: '2.5rem' }}>
              <h3 className="gqm-section-title">4. ORDER CONFIRM</h3>
              <div className="gqm-details-grid">
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Order Date</span>
                  <span className="gqm-detail-value">-</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Proposed PoF</span>
                  <span className="gqm-detail-value">-</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Lead Time</span>
                  <span className="gqm-detail-value">-</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Start Date</span>
                  <span className="gqm-detail-value">-</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Completion Date</span>
                  <span className="gqm-detail-value">-</span>
                </div>
                <div className="gqm-detail-item">
                  <span className="gqm-detail-label">Salesperson Declaration</span>
                  <span className="gqm-detail-value">Pending</span>
                </div>
              </div>
            </div>

            <div className="gqm-page-footer" style={{ marginTop: 'auto' }}>
              <span>www.tescostructures.com</span>
              <span>|</span>
              <span>+91 90032 28009</span>
              <span>|</span>
              <span>32, 10th St, Gandhi Nagar, Ashok Nagar, Chennai, Tamil Nadu 600083</span>
            </div>
          </div>
        </div>

        <div className="gqm-footer-actions">
          <button className="btn btn--secondary" onClick={onClose} style={{ minWidth: '120px' }}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={() => {
            alert('PDF Document Generated & Downloaded!');
            onClose();
          }} style={{ minWidth: '200px' }}>
            Download PDF Document
          </button>
        </div>
      </div>
    </div>
  );
}
