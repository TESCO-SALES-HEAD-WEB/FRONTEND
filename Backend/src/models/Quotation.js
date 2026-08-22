const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // e.g. QT-5001
    leadId: String,
    client: String,
    project: String,
    amount: String,
    gst: String,
    approvalStatus: { type: String, default: 'Pending' },
    quotationStatus: { type: String, default: 'In Preparation' },
    revision: { type: String, default: 'Rev 0' },
    fileName: { type: String, default: null },
    fileData: { type: String, default: null } // base64 data URI of the uploaded PDF (for Head review/download)
  },
  // strict:false so the full quotation record the apps write (line items, terms,
  // history, etc.) is read back in full on the shared `quotations` collection.
  { timestamps: true, strict: false }
);

module.exports = mongoose.model('Quotation', QuotationSchema);
