const router = require('express').Router();
const Appointment = require('../models/Appointment');

// GET /api/appointments — all appointments
router.get('/', async (req, res) => {
  try {
    const appts = await Appointment.find().sort({ createdAt: 1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/appointments — create one
router.post('/', async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);
    res.status(201).json(appt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/appointments/:id — update one
router.put('/:id', async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/appointments — clear all
router.delete('/', async (req, res) => {
  try {
    await Appointment.deleteMany({});
    res.json({ success: true, message: 'All appointments cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/appointments/:id — delete one
router.delete('/:id', async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndDelete(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
