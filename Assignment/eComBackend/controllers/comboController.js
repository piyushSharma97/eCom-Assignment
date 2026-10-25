const Combo = require('../models/Combo');
const { priceCombo } = require('../services/pricing');

function serializeCombo(combo) {
  const products = combo.productIds || [];
  const priced = priceCombo(products, combo.comboDiscountPercentage, 1);
  return {
    _id: combo._id,
    name: combo.name || products.map((p) => p.name).filter(Boolean).join(' + '),
    productIds: products,
    comboDiscountPercentage: combo.comboDiscountPercentage,
    isApplicable: products.length === 2 && products.every((p) => p && p._id),
    ...priced,
  };
}

exports.getCombos = async (req, res) => {
  try {
    const combos = await Combo.find().populate('productIds');
    const resultCombos = combos.map(serializeCombo);
    res.json({
      combos: resultCombos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCombo = async (req, res) => {
  const { productIds, comboDiscountPercentage, name } = req.body;
  try {
    if (!Array.isArray(productIds) || productIds.length !== 2) {
      return res.status(400).json({ error: 'A combo must contain exactly two product IDs' });
    }
    const combo = new Combo({ productIds, comboDiscountPercentage, name });
    const newCombo = await combo.save();
    const populated = await newCombo.populate('productIds');
    res.status(201).json(serializeCombo(populated));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getComboById = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id).populate('productIds');
    if (!combo) {
      return res.status(404).json({ error: 'Combo not found' });
    }
    res.json(serializeCombo(combo));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCombo = async (req, res) => {
  try {
    if (req.body.productIds && req.body.productIds.length !== 2) {
      return res.status(400).json({ error: 'A combo must contain exactly two product IDs' });
    }
    const updatedCombo = await Combo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('productIds');
    if (!updatedCombo) {
      return res.status(404).json({ error: 'Combo not found' });
    }
    res.json(serializeCombo(updatedCombo));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCombo = async (req, res) => {
  try {
    const deleted = await Combo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Combo not found' });
    }
    res.json({ message: 'Combo deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
