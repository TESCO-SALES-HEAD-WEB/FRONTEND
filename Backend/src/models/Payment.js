const mongoose = require('mongoose');

// One invoice / payment record for the Payment Collection page.
// All monetary fields are numeric so KPI totals can be computed from real data.
const PaymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // e.g. INV-1024
    leadId: String,            // optional link back to a lead
    customer: String,          // customer name
    orderValue: { type: Number, default: 0 },
    amountCollected: { type: Number, default: 0 },
    pendingPayments: { type: Number, default: 0 },
    upcomingDues: { type: Number, default: 0 },
    overduePayments: { type: Number, default: 0 },
    invoiceValue: { type: Number, default: 0 },
    dueDate: String,           // 'YYYY-MM-DD'
    manager: String,           // salesperson / manager (drives the All Managers filter)
    status: String,            // optional stored status; derived on the client when absent
    method: String,            // payment method (Cash/UPI/Bank Transfer/Cheque/Card)
    transactionId: String,     // reference / transaction id
    notes: String,             // free-text note on the payment
    paymentDate: String        // date the payment was recorded
  },
  // strict:false so the richer payment record the apps write (method, txn id, notes,
  // timeline, billing fields, invoice data) is read back in full for the Head's views.
  { timestamps: true, strict: false }
);

module.exports = mongoose.model('Payment', PaymentSchema);
