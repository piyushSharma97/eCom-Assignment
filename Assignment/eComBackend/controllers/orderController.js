const Order = require('../models/Order');
const Cart = require('../models/cart');
const { loadPricedCart } = require('./cartController');

function snapshotCart(priced) {
  return {
    items: (priced.items || []).map((item) => ({
      productId: item.product?._id,
      name: item.product?.name,
      picture: item.product?.picture,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
    combos: (priced.combos || []).map((combo) => ({
      comboId: combo.combo?._id,
      name: combo.combo?.name || (combo.items || []).map((i) => i.product?.name).join(' + '),
      quantity: combo.quantity,
      comboDiscountPercentage: combo.comboDiscountPercentage,
      total: combo.total,
      products: (combo.items || []).map((i) => i.product?.name),
    })),
    subtotalMain: priced.subtotalMain,
    productDiscount: priced.productDiscount,
    comboDiscount: priced.comboDiscount,
    totalDiscount: priced.totalDiscount,
    total: priced.total,
  };
}

exports.createOrder = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    if (!name || !email || !address) {
      return res.status(400).json({ error: 'Name, email, and address are required' });
    }
    const priced = await loadPricedCart(req.sessionId);
    if (!priced.items.length && !priced.combos.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    const snap = snapshotCart(priced);
    const order = await Order.create({
      sessionId: req.sessionId,
      customer: { name, email, address },
      ...snap,
      status: 'pending',
      paymentMethod: 'demo',
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.payOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, sessionId: req.sessionId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status === 'paid') {
      return res.json(order);
    }
    order.status = 'paid';
    await order.save();
    await Cart.findOneAndUpdate(
      { sessionId: req.sessionId },
      { items: [], combos: [] }
    );
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, sessionId: req.sessionId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
