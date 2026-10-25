const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
});

const comboCartItemSchema = new mongoose.Schema({
  combo: { type: mongoose.Schema.Types.ObjectId, ref: 'Combo', required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    items: [cartItemSchema],
    combos: [comboCartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
