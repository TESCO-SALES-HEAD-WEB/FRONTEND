const router = require('express').Router();
const Payment = require('../models/Payment');

// GET /api/payments — all
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: 1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments — create one
router.post('/', async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/payments/bulk — upsert array
router.post('/bulk', async (req, res) => {
  try {
    const payments = req.body;
    if (!Array.isArray(payments)) return res.status(400).json({ message: 'Expected an array' });
    const ops = payments.map(p => ({
      updateOne: { filter: { id: p.id }, update: { $set: p }, upsert: true }
    }));
    if (ops.length) await Payment.bulkWrite(ops);
    res.json({ success: true, count: payments.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/payments/:id
router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/payments — clear all
router.delete('/', async (req, res) => {
  try {
    await Payment.deleteMany({});
    res.json({ success: true, message: 'All payments cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/payments/:id
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({ id: req.params.id });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
