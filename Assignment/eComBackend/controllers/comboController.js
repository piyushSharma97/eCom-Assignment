const Combo = require('../models/Combo');
const Product = require('../models/Products');
const getComboResult=(combos,products)=>{
 return combos.map(combo => {
    const comboProductIds = combo.productIds.map(p => p._id.toString());

    let totalDiscount = 0;
    let total = 0;
    let applicableProducts = [];
    let comboApplicable = false;
    combo.productIds.forEach(product => {
      const productData = products.find(p => p._id.toString() === product._id.toString());

      if (productData) {
        applicableProducts.push(productData);

        if (product.discountedPrice == null) {
          const discount = (product.mainPrice * combo.comboDiscountPercentage) / 100;
          totalDiscount += discount;
          total += (product.mainPrice - discount);
        } else {
          totalDiscount += (product.mainPrice - product.discountedPrice);
          total += product.discountedPrice;
        }
      }
    });


    const comboProductIdsSet = new Set(comboProductIds);
    const isApplicable = comboProductIdsSet.size === applicableProducts.length;

    if (isApplicable) {
      comboApplicable = true;
    }

    return {
      combo,
      applicableProducts,
      isApplicable: comboApplicable,
      total,
      totalDiscount
    };
  });
}
// Get all combos
exports.getCombos = async (req, res) => {
  try {
    const combos = await Combo.find().populate('productIds');
    let allProductIds = [];


    combos.forEach(combo => {
      allProductIds = [...allProductIds, ...combo.productIds.map(p => p._id.toString())];
    });

    const products = await Product.find({ _id: { $in: allProductIds } });

    const resultCombos  = getComboResult(combos,products)
    const grandTotal = resultCombos.reduce((sum, combo) => sum + combo.total, 0);
    const grandTotalDiscount = resultCombos.reduce((sum, combo) => sum + combo.totalDiscount, 0);

    res.json({
      combos: resultCombos,
      grandTotal,
      grandTotalDiscount
    });
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new combo
exports.createCombo = async (req, res) => {
  const { productIds, comboDiscountPercentage } = req.body;
  const combo = new Combo({ productIds, comboDiscountPercentage });
  try {
    const newCombo = await combo.save();
    res.status(201).json(newCombo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get combo by ID
exports.getComboById = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id).populate('productIds');
    res.json(combo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a combo
exports.updateCombo = async (req, res) => {
  try {
    const updatedCombo = await Combo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCombo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a combo
exports.deleteCombo = async (req, res) => {
  try {
    await Combo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Combo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
