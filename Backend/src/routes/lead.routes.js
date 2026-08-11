const router = require('express').Router();
const Lead = require('../models/Lead');
const verifyApiKey = require('../middleware/apiKey');

// Map raw channel keys to the source labels the frontend recognizes.
const SOURCE_MAP = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  website: 'Website Enquiry',
  meta_ads: 'Meta Leads',
  meta: 'Meta Leads',
  google_ads: 'Meta Leads',
  linkedin: 'LinkedIn Leads',
  referral: 'Referral',
  cold: 'Cold Calling'
};

// Generate the next sequential lead id like "LD-1029".
// Falls back to a timestamp id if a race causes a duplicate.
async function nextLeadId() {
  const last = await Lead.findOne({ id: /^LD-\d+$/ }).sort({ createdAt: -1 }).lean();
  let n = 1000;
  if (last && last.id) {
    const parsed = parseInt(last.id.replace(/\D/g, ''), 10);
    if (!Number.isNaN(parsed)) n = parsed;
  }
  return `LD-${n + 1}`;
}

// POST /api/leads/intake — secured endpoint for n8n automation.
// Maps the normalized n8n payload onto the Lead schema using the exact field
// values/format the frontend Lead Management view expects, then creates the lead.
router.post('/intake', verifyApiKey, async (req, res) => {
  try {
    const { fullName, name, email, phone, message, source, campaign, receivedAt } = req.body;
    const now = receivedAt ? new Date(receivedAt) : new Date();

    const srcKey = (source || 'email').toLowerCase();
    const displaySource = SOURCE_MAP[srcKey] || source || 'Email';
    const displayDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const stamp = now.toLocaleDateString('en-GB') + ', ' + now.toLocaleTimeString('en-US', { hour12: false });

    const id = await nextLeadId();
    const payload = {
      id,
      type: 'new leads',
      date: displayDate,
      name: fullName || name || 'Unknown',
      phone: phone || '',
      email: email || '',
      campaign: campaign || '',
      source: displaySource,
      budget: '',
      status: 'New Lead',
      manager: 'Unassigned',
      followUp: 'No Date',
      priority: 'Medium',
      notes: message || '',
      history: [
        { timestamp: stamp, message: `Lead captured from ${displaySource}`, remark: campaign || '' }
      ]
    };

    let lead;
    try {
      lead = await Lead.create(payload);
    } catch (e) {
      if (e && e.code === 11000) {
        payload.id = `LD-${Date.now()}`;
        lead = await Lead.create(payload);
      } else {
        throw e;
      }
    }

    res.status(201).json({ success: true, id: lead.id, _id: lead._id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/leads — all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: 1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/leads — create one lead (auto-generates an LD- id when none supplied)
router.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.id) body.id = await nextLeadId();

    let lead;
    try {
      lead = await Lead.create(body);
    } catch (e) {
      if (e && e.code === 11000) {
        body.id = `LD-${Date.now()}`;
        lead = await Lead.create(body);
      } else {
        throw e;
      }
    }
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/leads/bulk — upsert leads (sync from frontend state)
router.post('/bulk', async (req, res) => {
  try {
    const leads = req.body;
    if (!Array.isArray(leads)) return res.status(400).json({ message: 'Expected an array' });
    const ops = leads.map(l => ({
      updateOne: {
        filter: { id: l.id },
        update: { $set: l },
        upsert: true
      }
    }));
    if (ops.length) await Lead.bulkWrite(ops);
    res.json({ success: true, count: leads.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/leads/:id — update one lead (by LD-xxxx id)
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/leads — clear all leads (admin/reset)
router.delete('/', async (req, res) => {
  try {
    await Lead.deleteMany({});
    res.json({ success: true, message: 'All leads cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/leads/:id — delete one lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ id: req.params.id });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
