const Product = require('../models/Products');
const Combo = require('../models/Combo');
const { unitPrice, priceCombo } = require('../services/pricing');

function searchableText(product) {
  return `${product.name || ''} ${product.description || ''}`.toLowerCase();
}

exports.suggest = async (req, res) => {
  try {
    const { productId, query } = req.body || {};
    const products = await Product.find();
    const combos = await Combo.find().populate('productIds');

    if (query && String(query).trim()) {
      const q = String(query).toLowerCase();
      const matches = products.filter((p) => searchableText(p).includes(q));
      return res.json({
        type: 'search',
        source: 'rules',
        results: matches,
      });
    }

    if (productId) {
      const related = combos
        .map((combo) => {
          const ids = (combo.productIds || []).map((p) => p._id.toString());
          if (!ids.includes(String(productId))) return null;
          const other = combo.productIds.find((p) => p._id.toString() !== String(productId));
          const priced = priceCombo(combo.productIds, combo.comboDiscountPercentage, 1);
          return {
            comboId: combo._id,
            addProduct: other,
            savings: priced.comboDiscount,
            comboTotal: priced.total,
            message: other
              ? `Add ${other.name} as a combo and save ${priced.comboDiscount.toFixed(2)}`
              : null,
          };
        })
        .filter(Boolean);

      return res.json({
        type: 'upsell',
        source: 'rules',
        suggestions: related,
      });
    }

    const kits = combos.slice(0, 6).map((combo) => {
      const priced = priceCombo(combo.productIds, combo.comboDiscountPercentage, 1);
      return {
        comboId: combo._id,
        products: combo.productIds,
        total: priced.total,
        savings: priced.comboDiscount,
      };
    });

    res.json({
      type: 'kits',
      source: 'rules',
      suggestions: kits,
      cheapest: products
        .slice()
        .sort((a, b) => unitPrice(a) - unitPrice(b))
        .slice(0, 4),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
