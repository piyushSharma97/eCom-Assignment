const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
    },
    items: { type: Array, default: [] },
    combos: { type: Array, default: [] },
    subtotalMain: { type: Number, required: true },
    productDiscount: { type: Number, default: 0 },
    comboDiscount: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'demo' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
