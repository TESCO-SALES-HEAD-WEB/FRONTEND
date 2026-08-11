const mongoose = require('mongoose');

// Mirrors the Coordinator/Manager `projects` collection (Order-Confirmation / handover
// records) in the shared `salescrm` database, so the Sales Head's Orders page shows the
// same order-confirmation records as the two apps. strict:false lets the full
// Sales-to-Project Handover form persist all its fields (leadId, siteAddress,
// paymentTerms[], design flags, declarations, etc.).
const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // Lead / handover id e.g. PF-1001
    client: String,
    type: String,
    location: String,
    salesperson: String,
    value: Number,
    quote: String,
    team: String,
    status: { type: String, default: 'Order Confirmed' },
    files: { type: Number, default: 0 }
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model('Project', ProjectSchema);
