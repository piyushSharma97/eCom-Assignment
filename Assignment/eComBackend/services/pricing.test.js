const { unitPrice, priceCombo, priceProductLine, priceCart } = require('./pricing');

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

const mug = { name: 'Mug', mainPrice: 100, discountedPrice: 80 };
const beans = { name: 'Beans', mainPrice: 50, discountedPrice: null };

assertEqual(unitPrice(mug), 80, 'unit with discount');
assertEqual(unitPrice(beans), 50, 'unit without discount');

const combo = priceCombo([mug, beans], 10, 1);
assertEqual(combo.subtotalUnit, 130, 'combo unit subtotal');
assertEqual(combo.comboDiscount, 13, 'combo extra 10%');
assertEqual(combo.total, 117, 'combo total');

const line = priceProductLine(mug, 2);
assertEqual(line.lineTotal, 160, 'product line');

const cart = priceCart({
  items: [{ product: mug, quantity: 1 }],
  combos: [{ combo: { productIds: [mug, beans], comboDiscountPercentage: 10 }, quantity: 1 }],
});
assertEqual(cart.total, 197, 'cart total');

console.log('pricing tests passed');
