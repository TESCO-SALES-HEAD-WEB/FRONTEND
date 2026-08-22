const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    title: String,
    date: String,        // 'YYYY-MM-DD'
    timeStart: String,   // '04:00 PM'
    timeEnd: String,     // '05:00 PM'
    manager: String,
    phone: String,
    location: String,
    status: { type: String, default: 'Waiting' },
    type: { type: String, default: 'Appointment' },
    // Set when a manager reschedules, so the coordinator can be notified and see the change
    rescheduledAt: String,
    rescheduledBy: String
  },
  // strict:false so the manager app's richer visit fields persist on the shared collection
  { timestamps: true, strict: false }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
