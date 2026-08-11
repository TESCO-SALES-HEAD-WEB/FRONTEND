const router = require('express').Router();
const Quotation = require('../models/Quotation');

// GET /api/quotations — all
router.get('/', async (req, res) => {
  try {
    const quotes = await Quotation.find().sort({ createdAt: 1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/quotations — create one
router.post('/', async (req, res) => {
  try {
    const quote = await Quotation.create(req.body);
    res.status(201).json(quote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/quotations/bulk — upsert array (sync from frontend state)
router.post('/bulk', async (req, res) => {
  try {
    const quotes = req.body;
    if (!Array.isArray(quotes)) return res.status(400).json({ message: 'Expected an array' });
    const ops = quotes.map(q => ({
      updateOne: { filter: { id: q.id }, update: { $set: q }, upsert: true }
    }));
    if (ops.length) await Quotation.bulkWrite(ops);
    res.json({ success: true, count: quotes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/quotations/:id
router.put('/:id', async (req, res) => {
  try {
    const quote = await Quotation.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
    if (!quote) return res.status(404).json({ message: 'Quotation not found' });
    res.json(quote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/quotations — clear all
router.delete('/', async (req, res) => {
  try {
    await Quotation.deleteMany({});
    res.json({ success: true, message: 'All quotations cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/quotations/:id
router.delete('/:id', async (req, res) => {
  try {
    const quote = await Quotation.findOneAndDelete({ id: req.params.id });
    if (!quote) return res.status(404).json({ message: 'Quotation not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
