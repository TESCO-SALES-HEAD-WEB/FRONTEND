import React from 'react';
import { X, Pencil, Save, Upload, FileText, Download, Bell, CheckCircle } from 'lucide-react';

// ── Money helpers ──────────────────────────────────────────────
export const parseAmount = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const n = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
};
// Indian grouping: 450000 -> ₹4,50,000
const formatINR = (n) => '₹' + Math.round(parseAmount(n)).toLocaleString('en-IN');
// Compact: 24000000 -> ₹2.4Cr, 4500000 -> ₹45L
export const formatCompact = (val) => {
  const n = parseAmount(val);
  const trim = (v) => Number(v.toFixed(2)).toString();
  if (n >= 1e7) return '₹' + trim(n / 1e7) + 'Cr';
  if (n >= 1e5) return '₹' + trim(n / 1e5) + 'L';
  if (n >= 1e3) return '₹' + trim(n / 1e3) + 'K';
  return '₹' + Math.round(n);
};

// Derive an invoice's status from its numbers when one isn't stored.
export const deriveStatus = (p) => {
  if (!p) return 'Pending';
  if (p.status) return p.status;
  const invoice = Number(p.invoiceValue) || Number(p.orderValue) || 0;
  const collected = Number(p.amountCollected) || 0;
  if ((Number(p.overduePayments) || 0) > 0) return 'Overdue';
  if (invoice > 0 && collected >= invoice) return 'Paid';
  if (collected > 0) return 'Partial';
  return 'Pending';
};

const STATUS_OPTIONS = ['Paid', 'Partial', 'Pending', 'Overdue'];
const PAYMENT_METHODS = ['Bank Transfer', 'UPI', 'Cheque', 'Cash'];

// Status → badge colour
const STATUS_COLORS = {
  Paid: '#22C55E',
  Partial: '#3B82F6',
  Pending: '#F59E0B',
  Overdue: '#EF4444',
};

// Format an ISO timestamp OR a 'YYYY-MM-DD' string into a readable date; '' when empty/invalid
export const fmtAny = (val) => {
  if (!val) return '';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Build the drawer's Timeline purely from the record's REAL data — no placeholder dates.
export const deriveTimeline = (p) => {
  if (!p) return [];
  const events = [];
  const status = deriveStatus(p);
  const collected = Number(p.amountCollected) || 0;
  const invoice = Number(p.invoiceValue) || Number(p.orderValue) || 0;
  const fullyPaid = invoice > 0 && collected >= invoice;

  if (p.createdAt) events.push({ label: 'Invoice Generated', date: p.createdAt });
  if (p.reminderSentAt) events.push({ label: 'Payment Reminder Sent', date: p.reminderSentAt });
  if (collected > 0 && !fullyPaid && p.paymentDate) {
    events.push({ label: 'Partial Payment Received', date: p.paymentDate });
  }
  if (status === 'Paid' && (p.paymentDate || p.dueDate)) {
    events.push({ label: 'Full Payment Cleared', date: p.paymentDate || p.dueDate });
  }
  // Fold in any extra custom entries stored on the record (each {label, date})
  if (Array.isArray(p.timeline)) {
    p.timeline.forEach((e) => { if (e && e.label) events.push(e); });
  }
  return events;
};

// The Head app doesn't define the CSS design tokens the Coordinator uses, so
// every var(--token) below carries a concrete fallback.
const inputStyle = {
  width: '100%', padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-md,8px)',
  border: '1px solid var(--border-color,#E2E8F0)', outline: 'none', fontSize: '0.9rem',
  backgroundColor: 'var(--surface-color,#ffffff)', color: 'var(--text-main,#1F2937)',
};
const labelStyle = {
  display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main,#1F2937)',
};

// The Head app doesn't ship the .btn / .btn-primary / .btn-outline classes — inline them.
const btnBase = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
  border: 'none', borderRadius: 'var(--radius-md,8px)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
};
const btnPrimary = { ...btnBase, backgroundColor: 'var(--primary-color,#4F46E5)', color: '#fff' };
const btnOutline = {
  ...btnBase, backgroundColor: '#ffffff',
  border: '1px solid var(--border-color,#E2E8F0)', color: 'var(--text-main,#1F2937)',
};

// ── Payment Collection detail drawer ─────────────────────────────
const DRAWER_TABS = [
  { key: 'overview', label: 'Payment Overview' },
  { key: 'billing', label: 'Billing Details' },
  { key: 'upload', label: 'Upload Invoice' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'notes', label: 'Notes' },
];

const PaymentDrawer = ({
  record, mode, setMode, tab, setTab, editForm, setEditForm, rebuildEditForm,
  saving, onClose, onSaveEdits, newNote, setNewNote, onSaveNote,
  uploadForm, setUploadForm, onInvoiceFile, onSubmitUpload,
  onSendReminder, onLogPayment, onDownload, leads = [], managerOptions = [],
}) => {
  const isEdit = mode === 'edit';
  const status = deriveStatus(record);
  const badgeColor = STATUS_COLORS[status] || '#4F46E5';
  const lead = leads.find((l) => l.id === record.leadId);
  const upd = (k, v) => setEditForm((f) => ({ ...f, [k]: v }));

  const startEdit = () => { setEditForm(rebuildEditForm()); setMode('edit'); };
  const cancelEdit = () => { setEditForm(rebuildEditForm()); setMode('view'); };

  // View-mode values (billing falls back to the linked lead — never invents data)
  const bv = {
    clientName: record.clientName || record.customer || '',
    projectLocation: record.projectLocation || lead?.appointmentLocation || '',
    contactDetails: record.contactDetails || [lead?.phone, lead?.email].filter(Boolean).join(' / '),
    billingName: record.billingName || record.customer || '',
    mobileNumber: record.mobileNumber || lead?.phone || '',
    altMobile: record.altMobile || '',
    siteAddress: record.siteAddress || lead?.appointmentLocation || '',
    billingAddress: record.billingAddress || '',
    gstNumber: record.gstNumber || '',
    email: record.email || lead?.email || '',
    salesperson: record.salesperson || record.manager || lead?.manager || '',
  };

  const cardStyle = { border: '1px solid var(--border-color,#E2E8F0)', borderRadius: 'var(--radius-lg,12px)', padding: '1.1rem 1.25rem' };
  const cardTitle = { margin: '0 0 0.9rem', fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main,#1F2937)' };
  const smallInput = { ...inputStyle, padding: '0.5rem 0.65rem', fontSize: '0.85rem' };

  // Render one Payment Overview stat (view: label/value, edit: label/input)
  const OverviewStat = ({ k, label, type }) => {
    const raw = record[k];
    let display;
    if (type === 'money') display = formatINR(raw);
    else if (type === 'date') display = fmtAny(raw) || '—';
    else if (type === 'status') display = status;
    else display = raw || '—';
    return (
      <div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted,#64748B)', marginBottom: '0.3rem' }}>{label}</div>
        {isEdit ? (
          type === 'status' ? (
            <select value={editForm?.status || ''} onChange={(e) => upd('status', e.target.value)} style={{ ...smallInput, appearance: 'none' }}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <input
              type={type === 'date' ? 'date' : 'text'}
              inputMode={type === 'money' ? 'numeric' : undefined}
              value={editForm?.[k] ?? ''}
              onChange={(e) => upd(k, e.target.value)}
              style={smallInput}
            />
          )
        ) : (
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main,#1F2937)' }}>{display}</div>
        )}
      </div>
    );
  };

  // Render one Billing Details field
  const BillingField = ({ k, label }) => (
    <div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted,#64748B)', marginBottom: '0.3rem' }}>{label}</div>
      {isEdit ? (
        <input value={editForm?.[k] ?? ''} onChange={(e) => upd(k, e.target.value)} style={smallInput} />
      ) : (
        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main,#1F2937)', wordBreak: 'break-word' }}>{bv[k] || '—'}</div>
      )}
    </div>
  );

  const timelineEvents = deriveTimeline(record)
    .filter((e) => e.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const notes = Array.isArray(record.notesLog) ? record.notesLog : [];

  const footerBtn = {
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
    padding: '0.7rem 0.5rem', borderRadius: 'var(--radius-md,8px)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(600px, 100%)', height: '100%', backgroundColor: 'var(--surface-color,#ffffff)',
          display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg,-8px 0 30px rgba(0,0,0,0.25))',
          animation: 'none',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color,#E2E8F0)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main,#1F2937)' }}>{record.id || '—'}</h3>
              <span style={{ padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', color: '#fff', backgroundColor: badgeColor }}>{status}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isEdit ? (
                <>
                  <button type="button" onClick={onSaveEdits} disabled={saving} className="btn" style={{ ...btnBase, backgroundColor: '#16A34A', color: '#fff', padding: '0.4rem 0.9rem', fontSize: '0.85rem', gap: '0.35rem', opacity: saving ? 0.6 : 1 }}>
                    <Save size={15} /> {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button type="button" onClick={cancelEdit} className="btn btn-outline" style={{ ...btnOutline, padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Cancel</button>
                </>
              ) : (
                <button type="button" onClick={startEdit} className="btn btn-outline" style={{ ...btnOutline, padding: '0.4rem 0.8rem', fontSize: '0.85rem', gap: '0.35rem' }}>
                  <Pencil size={15} /> Edit
                </button>
              )}
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted,#64748B)' }}><X size={22} /></button>
            </div>
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main,#1F2937)' }}>{bv.billingName || '—'}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted,#64748B)' }}>{bv.clientName || record.customer || '—'}</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.15rem', padding: '0 0.6rem', borderBottom: '1px solid var(--border-color,#E2E8F0)', flexWrap: 'wrap' }}>
          {DRAWER_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                padding: '0.85rem 0.6rem', fontSize: '0.82rem', fontWeight: '600',
                color: tab === t.key ? 'var(--secondary-color,#4F46E5)' : 'var(--text-muted,#64748B)',
                borderBottom: tab === t.key ? '2px solid var(--secondary-color,#4F46E5)' : '2px solid transparent',
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {tab === 'overview' && (
            <>
              <div style={cardStyle}>
                <h4 style={cardTitle}>Payment Status</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    ['orderValue', 'Order Value', 'money'],
                    ['amountCollected', 'Amount Collected', 'money'],
                    ['upcomingDues', 'Upcoming Dues', 'money'],
                    ['pendingPayments', 'Pending Payments', 'money'],
                    ['overduePayments', 'Overdue Payments', 'money'],
                    ['invoiceValue', 'Invoice Value', 'money'],
                    ['dueDate', 'Due Date', 'date'],
                    ['status', 'Status', 'status'],
                  ].map(([k, label, type]) => <OverviewStat key={k} k={k} label={label} type={type} />)}
                </div>
              </div>
              <div style={cardStyle}>
                <h4 style={cardTitle}>Payment Method</h4>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted,#64748B)', marginBottom: '0.3rem' }}>Selected Method</div>
                  {isEdit ? (
                    <select value={editForm?.method || ''} onChange={(e) => upd('method', e.target.value)} style={{ ...smallInput, appearance: 'none' }}>
                      <option value="">Select Method</option>
                      {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : (
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main,#1F2937)' }}>{record.method || '—'}</div>
                  )}
                </div>
              </div>
            </>
          )}

          {tab === 'billing' && (
            <div style={cardStyle}>
              <h4 style={cardTitle}>Client &amp; Project Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  ['clientName', 'Client Name'],
                  ['projectLocation', 'Project Location'],
                  ['contactDetails', 'Contact Details'],
                  ['billingName', 'Billing Name'],
                  ['mobileNumber', 'Mobile Number'],
                  ['altMobile', 'Alternate Mobile Number'],
                  ['siteAddress', 'Site Address'],
                  ['billingAddress', 'Billing Address'],
                  ['gstNumber', 'GST Number'],
                  ['email', 'Email ID / WhatsApp'],
                  ['salesperson', 'Salesperson'],
                ].map(([k, label]) => <BillingField key={k} k={k} label={label} />)}
              </div>
            </div>
          )}

          {tab === 'upload' && (
            <div style={cardStyle}>
              <h4 style={cardTitle}>Upload Invoice</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Invoice Value (₹)</label>
                  <input
                    type="text" inputMode="numeric" value={uploadForm.invoiceValue}
                    onChange={(e) => setUploadForm((f) => ({ ...f, invoiceValue: e.target.value }))}
                    placeholder="e.g. 425000" style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Upload Document</label>
                  <input type="file" onChange={(e) => onInvoiceFile(e.target.files && e.target.files[0])} style={{ ...inputStyle, padding: '0.5rem' }} />
                  {uploadForm.fileName && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted,#64748B)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={15} />
                      {uploadForm.fileData
                        ? <a href={uploadForm.fileData} download={uploadForm.fileName} style={{ color: 'var(--secondary-color,#4F46E5)' }}>{uploadForm.fileName}</a>
                        : uploadForm.fileName}
                    </div>
                  )}
                </div>
                <button type="button" onClick={onSubmitUpload} disabled={saving} className="btn btn-primary" style={{ ...btnPrimary, alignSelf: 'flex-start', padding: '0.6rem 1.4rem', gap: '0.4rem', opacity: saving ? 0.6 : 1 }}>
                  <Upload size={16} /> {saving ? 'Saving…' : 'Submit'}
                </button>
              </div>
            </div>
          )}

          {tab === 'timeline' && (
            <div style={cardStyle}>
              <h4 style={cardTitle}>Timeline</h4>
              {timelineEvents.length === 0 ? (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted,#64748B)' }}>No timeline events yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {timelineEvents.map((e, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: 'var(--secondary-color,#4F46E5)', marginTop: '0.3rem', flexShrink: 0 }} />
                        {i < timelineEvents.length - 1 && <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--border-color,#E2E8F0)', minHeight: '1.5rem' }} />}
                      </div>
                      <div style={{ paddingBottom: '1rem' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main,#1F2937)' }}>{e.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted,#64748B)' }}>{fmtAny(e.date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'notes' && (
            <div style={cardStyle}>
              <h4 style={cardTitle}>Notes</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Add Note</label>
                <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Write a note…" style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} />
                <button type="button" onClick={onSaveNote} disabled={saving || !newNote.trim()} className="btn btn-primary" style={{ ...btnPrimary, marginTop: '0.6rem', padding: '0.5rem 1.2rem', opacity: (saving || !newNote.trim()) ? 0.5 : 1 }}>
                  {saving ? 'Saving…' : 'Save Note'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {record.notes && (
                  <div style={{ borderTop: '1px solid var(--border-color,#E2E8F0)', paddingTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main,#1F2937)', whiteSpace: 'pre-wrap' }}>{record.notes}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted,#64748B)', marginTop: '0.25rem' }}>Original payment note</div>
                  </div>
                )}
                {notes.length === 0 && !record.notes && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted,#64748B)' }}>No notes yet.</div>
                )}
                {[...notes].reverse().map((n, i) => (
                  <div key={i} style={{ borderTop: '1px solid var(--border-color,#E2E8F0)', paddingTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main,#1F2937)', whiteSpace: 'pre-wrap' }}>{n.text}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted,#64748B)', marginTop: '0.25rem' }}>{fmtAny(n.timestamp)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: '0.6rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color,#E2E8F0)' }}>
          <button type="button" onClick={onDownload} style={{ ...footerBtn, backgroundColor: 'var(--secondary-color,#4F46E5)', color: '#fff', border: 'none' }}>
            <Download size={16} /> Invoice
          </button>
          <button type="button" onClick={onSendReminder} disabled={saving} style={{ ...footerBtn, backgroundColor: 'transparent', color: 'var(--text-main,#1F2937)', border: '1px solid var(--border-color,#E2E8F0)', opacity: saving ? 0.6 : 1 }}>
            <Bell size={16} /> Reminder
          </button>
          <button type="button" onClick={onLogPayment} disabled={saving} style={{ ...footerBtn, backgroundColor: '#16A34A', color: '#fff', border: 'none', opacity: saving ? 0.6 : 1 }}>
            <CheckCircle size={16} /> Log Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDrawer;
