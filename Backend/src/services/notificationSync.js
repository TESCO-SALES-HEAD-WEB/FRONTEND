const Notification = require('../models/Notification');
const Lead = require('../models/Lead');
const Appointment = require('../models/Appointment');
const Quotation = require('../models/Quotation');
const Payment = require('../models/Payment');
const Project = require('../models/Project');

// --- Small formatting helpers (no invented data — read real fields only) -------------

const toDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

// Best real event time available on a source doc.
const eventTime = (doc, ...prefer) => {
  for (const v of prefer) {
    const d = toDate(v);
    if (d) return d;
  }
  return toDate(doc.updatedAt) || toDate(doc.createdAt) || new Date();
};

// "2026-08-12" / ISO -> "12 Aug"
const shortDate = (v) => {
  const d = toDate(v);
  if (!d) return String(v || '').trim();
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// 850000 / "₹8,50,000" -> "₹8,50,000"
const money = (v) => {
  if (v == null || v === '') return '';
  let s = String(v).toLowerCase().replace(/[₹,\s]/g, '');
  let x = 1;
  if (s.endsWith('cr')) { x = 1e7; s = s.slice(0, -2); }
  else if (s.endsWith('l')) { x = 1e5; s = s.slice(0, -1); }
  else if (s.endsWith('k')) { x = 1e3; s = s.slice(0, -1); }
  const n = parseFloat(s.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(n)) return '';
  return '₹' + Math.round(n * x).toLocaleString('en-IN');
};

const has = (v) => v != null && String(v).trim() !== '';
const isUnassigned = (v) => !has(v) || /^unassigned$/i.test(String(v).trim());

// Throttle: the sync is called on every notifications load + 30s poll. Keep it cheap by
// running the full scan at most once every WINDOW_MS; between runs, loads just read the
// already-synced docs. Idempotent either way (upsert on dedupeKey).
const WINDOW_MS = 15 * 1000;
let lastSyncAt = 0;
let inFlight = null;

async function runSync() {
  const [leads, appts, quotes, payments, projects] = await Promise.all([
    Lead.find().lean(),
    Appointment.find().lean(),
    Quotation.find().lean(),
    Payment.find().lean(),
    Project.find().lean()
  ]);

  const ops = [];
  // This app delivers only to the Sales Head role. Prefix every dedupeKey with `head:`
  // so the shared collection never collides with Manager/Coordinator notifications, and
  // stamp recipientRole so the GET routes can filter to Sales Head only.
  const add = (dedupeKey, doc) => {
    const key = `head:${dedupeKey}`;
    ops.push({
      updateOne: {
        filter: { dedupeKey: key },
        // $setOnInsert so re-scanning never overwrites an already-read notification.
        update: { $setOnInsert: { dedupeKey: key, recipientRole: 'Sales Head', isRead: false, ...doc } },
        upsert: true
      }
    });
  };

  // --- Leads: assignment + status progression ---------------------------------------
  for (const l of leads) {
    const code = l.id || l._id;
    const mgr = l.manager || l.assignedTo;
    if (has(code) && !isUnassigned(mgr)) {
      add(`lead-assigned:${code}:${mgr}`, {
        type: 'LEAD_ASSIGNED',
        title: 'New Lead Assigned',
        message: `Lead ${code} has been assigned to Manager ${mgr}.`,
        entityType: 'lead',
        entityId: String(code),
        eventAt: eventTime(l, l.createdAt)
      });
    }
    // Only meaningful stage changes — never the initial "New Lead" creation state.
    const status = (l.status || '').trim();
    if (has(code) && status && !/^new(\s*lead)?s?$/i.test(status)) {
      add(`lead-status:${code}:${status}`, {
        type: 'LEAD_STATUS_CHANGED',
        title: 'Lead Status Updated',
        message: `${code} moved to ${status}.`,
        entityType: 'lead',
        entityId: String(code),
        eventAt: eventTime(l)
      });
    }

    // Follow-up reminder — the lead's next follow-up date has arrived (or passed) and the
    // lead is still open. Keyed per (lead, follow-up date) so each reminder fires only once.
    const fu = toDate(l.followUp);
    const closedState = /junk|lost|completed|order\s*confirmed/i.test(status);
    if (has(code) && fu && !closedState) {
      const endToday = new Date(); endToday.setHours(23, 59, 59, 999);
      if (fu.getTime() <= endToday.getTime()) {
        add(`lead-followup:${code}:${fu.toISOString().slice(0, 10)}`, {
          type: 'LEAD_FOLLOWUP_DUE',
          title: 'Follow-up Reminder',
          message: `Follow-up for Lead ${code}${has(l.name) ? ` (${l.name})` : ''} is due on ${shortDate(l.followUp)}.`,
          entityType: 'lead',
          entityId: String(code),
          eventAt: fu
        });
      }
    }
  }

  // --- Appointments: scheduled / rescheduled / completed ----------------------------
  for (const a of appts) {
    const ref = a.leadId || a.title || 'appointment';
    const when = [shortDate(a.date), a.timeStart].filter(has).join(', ');
    if (a.date) {
      add(`appt-sched:${a._id}:${a.date}`, {
        type: 'APPOINTMENT_SCHEDULED',
        title: 'Appointment Scheduled',
        message: `Visit for ${ref}${when ? ` on ${when}` : ''}.`,
        entityType: 'appointment',
        entityId: String(a._id),
        eventAt: eventTime(a)
      });
    }
    if (has(a.rescheduledAt)) {
      add(`appt-resched:${a._id}:${a.rescheduledAt}`, {
        type: 'APPOINTMENT_RESCHEDULED',
        title: 'Appointment Rescheduled',
        message: `Visit for ${ref} was rescheduled${a.rescheduledBy ? ` by ${a.rescheduledBy}` : ''}${when ? ` to ${when}` : ''}.`,
        entityType: 'appointment',
        entityId: String(a._id),
        eventAt: eventTime(a, a.rescheduledAt)
      });
    }
    const completed = /complet/i.test(a.status || '') ||
      /^completed$/i.test(a.progressStatus || '') || has(a.completedAt);
    if (completed) {
      add(`visit-completed:${a._id}:${a.completedAt || a.date || ''}`, {
        type: 'VISIT_COMPLETED',
        title: 'Visit Completed',
        message: `Site visit for ${ref} has been marked completed${a.completedBy ? ` by ${a.completedBy}` : ''}.`,
        entityType: 'appointment',
        entityId: String(a._id),
        eventAt: eventTime(a, a.completedAt)
      });
    }
  }

  // --- Quotations: uploaded (Prepared) / approved / rejected ------------------------
  for (const q of quotes) {
    const id = q.id || q._id;
    const forRef = q.leadId || q.client || 'client';
    const qStatus = (q.quotationStatus || '').toLowerCase();
    const aStatus = (q.approvalStatus || '').toLowerCase();
    if (has(id) && qStatus === 'prepared' && aStatus !== 'approved' && aStatus !== 'rejected') {
      add(`quotation-uploaded:${id}`, {
        type: 'QUOTATION_UPLOADED',
        title: 'Quotation Uploaded',
        message: `Quotation ${id} for ${forRef} is ready for your review.`,
        entityType: 'quotation',
        entityId: String(id),
        eventAt: eventTime(q)
      });
    }
    if (has(id) && aStatus === 'approved') {
      add(`quotation-approved:${id}`, {
        type: 'QUOTATION_APPROVED',
        title: 'Quotation Approved',
        message: `Quotation for ${forRef} has been approved.`,
        entityType: 'quotation',
        entityId: String(id),
        eventAt: eventTime(q, q.reviewedAt)
      });
    }
    if (has(id) && aStatus === 'rejected') {
      add(`quotation-rejected:${id}`, {
        type: 'QUOTATION_REJECTED',
        title: 'Quotation Rejected',
        message: `Quotation for ${forRef} has been rejected${has(q.rejectionReason) ? ` — ${q.rejectionReason}` : ''}.`,
        entityType: 'quotation',
        entityId: String(id),
        eventAt: eventTime(q, q.reviewedAt)
      });
    }
  }

  // --- Projects: order confirmed ----------------------------------------------------
  for (const p of projects) {
    const id = p.id || p._id;
    if (!has(id)) continue;
    const amount = money(p.value);
    add(`order-confirmed:${id}`, {
      type: 'ORDER_CONFIRMED',
      title: 'Order Confirmed',
      message: `Order ${id}${p.client ? ` for ${p.client}` : ''} has been confirmed${amount ? ` (${amount})` : ''}.`,
      entityType: 'project',
      entityId: String(id),
      eventAt: eventTime(p)
    });
  }

  // --- Payments: payment received ---------------------------------------------------
  for (const pay of payments) {
    const id = pay.id || pay._id;
    const collected = Number(pay.amountCollected) || 0;
    if (!has(id) || collected <= 0) continue;
    const who = pay.customer || pay.leadId || 'customer';
    add(`payment-received:${id}`, {
      type: 'PAYMENT_RECEIVED',
      title: 'Payment Received',
      message: `${money(collected)} recorded for ${who}.`,
      entityType: 'payment',
      entityId: String(id),
      eventAt: eventTime(pay, pay.paymentDate)
    });
  }

  if (ops.length) {
    // ordered:false so one duplicate-key race can't abort the rest of the batch.
    await Notification.bulkWrite(ops, { ordered: false }).catch((e) => {
      // Duplicate-key errors are expected/benign under concurrency — swallow only those.
      if (!e || e.code !== 11000) throw e;
    });
  }
}

// Idempotent, throttled sync. Safe to await at the start of GET handlers.
async function syncNotifications({ force = false } = {}) {
  if (!force && Date.now() - lastSyncAt < WINDOW_MS) return;
  if (inFlight) return inFlight;
  inFlight = runSync()
    .then(() => { lastSyncAt = Date.now(); })
    .catch((e) => { console.error('notificationSync error:', e.message); })
    .finally(() => { inFlight = null; });
  return inFlight;
}

module.exports = { syncNotifications };
