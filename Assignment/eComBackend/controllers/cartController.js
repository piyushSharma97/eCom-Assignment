const Cart = require('../models/cart');
const Combo = require('../models/Combo');
const Product = require('../models/Products');
const { priceCart } = require('../services/pricing');

const cartPopulate = [
  {
    path: 'items.product',
    select: 'name mainPrice discountedPrice description picture sku',
  },
  {
    path: 'combos.combo',
    select: 'productIds comboDiscountPercentage name',
    populate: {
      path: 'productIds',
      select: 'name mainPrice discountedPrice picture sku',
    },
  },
];

async function getOrCreateCart(sessionId) {
  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [], combos: [] });
  }
  return cart;
}

async function loadPricedCart(sessionId) {
  const cart = await Cart.findOne({ sessionId }).populate(cartPopulate);
  if (!cart) {
    return { sessionId, items: [], combos: [], subtotalMain: 0, productDiscount: 0, comboDiscount: 0, totalDiscount: 0, total: 0, comboApplied: false };
  }
  return {
    _id: cart._id,
    sessionId: cart.sessionId,
    ...priceCart(cart),
  };
}

exports.getCart = async (req, res) => {
  try {
    await getOrCreateCart(req.sessionId);
    const priced = await loadPricedCart(req.sessionId);
    res.json(priced);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity) > 0 ? Number(quantity) : 1;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const cart = await getOrCreateCart(req.sessionId);
    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }
    await cart.save();
    res.json(await loadPricedCart(req.sessionId));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await getOrCreateCart(req.sessionId);
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    res.json(await loadPricedCart(req.sessionId));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeComboFromCart = async (req, res) => {
  const { comboId } = req.body;
  try {
    const cart = await getOrCreateCart(req.sessionId);
    const comboItem = cart.combos.find((item) => item.combo.equals(comboId));
    if (!comboItem) {
      return res.status(404).json({ error: 'Combo not found in the cart' });
    }
    cart.combos = cart.combos.filter((item) => !item.combo.equals(comboId));
    await cart.save();
    res.json(await loadPricedCart(req.sessionId));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addComboItems = async (req, res) => {
  const { comboId, quantity } = req.body;
  const qty = Number(quantity) > 0 ? Number(quantity) : 1;
  try {
    const combo = await Combo.findById(comboId);
    if (!combo) {
      return res.status(404).json({ error: 'Combo not found' });
    }
    const cart = await getOrCreateCart(req.sessionId);
    const existingComboItem = cart.combos.find((item) => item.combo.equals(comboId));
    if (existingComboItem) {
      existingComboItem.quantity += qty;
    } else {
      cart.combos.push({ combo: comboId, quantity: qty });
    }
    await cart.save();
    res.status(201).json(await loadPricedCart(req.sessionId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.calculateCartTotal = async (req, res) => {
  try {
    await getOrCreateCart(req.sessionId);
    const priced = await loadPricedCart(req.sessionId);
    res.json({
      total: priced.total,
      totalDiscount: priced.totalDiscount,
      comboDiscount: priced.comboDiscount,
      comboApplied: priced.comboApplied,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loadPricedCart = loadPricedCart;
exports.getOrCreateCart = getOrCreateCart;
