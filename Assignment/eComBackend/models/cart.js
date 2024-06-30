const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
});
const comboCartItemSchema = new mongoose.Schema({
  combo: { type: mongoose.Schema.Types.ObjectId, ref: 'Combo', required: true },
  quantities: [{ type: Number, required: true }],
});
const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
  combos: [comboCartItemSchema],
});

module.exports = mongoose.model('Cart', cartSchema);