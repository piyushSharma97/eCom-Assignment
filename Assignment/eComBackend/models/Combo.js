const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    productIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
      validate: {
        validator: (ids) => Array.isArray(ids) && ids.length === 2,
        message: 'A combo must contain exactly two products',
      },
    },
    comboDiscountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Combo', comboSchema);
