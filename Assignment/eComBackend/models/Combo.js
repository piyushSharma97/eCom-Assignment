const mongoose = require('mongoose');


const comboSchema = new mongoose.Schema({
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  comboDiscountPercentage: { type: Number, required: true }
});

module.exports = mongoose.model('Combo', comboSchema);
