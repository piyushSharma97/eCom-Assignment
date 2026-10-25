function unitPrice(product) {
  if (!product) return 0;
  const discounted = Number(product.discountedPrice);
  const main = Number(product.mainPrice) || 0;
  if (Number.isFinite(discounted) && discounted > 0) {
    return discounted;
  }
  return main;
}

function priceCombo(products, comboDiscountPercentage, quantity = 1) {
  const qty = Number(quantity) > 0 ? Number(quantity) : 1;
  const percent = Number(comboDiscountPercentage) || 0;
  const items = (products || []).map((product) => {
    const mainPrice = Number(product.mainPrice) || 0;
    const unit = unitPrice(product);
    return {
      product,
      mainPrice,
      unitPrice: unit,
      productDiscount: Math.max(0, mainPrice - unit),
    };
  });

  const subtotalMain = items.reduce((sum, item) => sum + item.mainPrice, 0) * qty;
  const subtotalUnit = items.reduce((sum, item) => sum + item.unitPrice, 0) * qty;
  const comboDiscount = (subtotalUnit * percent) / 100;
  const total = Number((subtotalUnit - comboDiscount).toFixed(2));

  return {
    items,
    quantity: qty,
    comboDiscountPercentage: percent,
    subtotalMain: Number(subtotalMain.toFixed(2)),
    subtotalUnit: Number(subtotalUnit.toFixed(2)),
    comboDiscount: Number(comboDiscount.toFixed(2)),
    total,
  };
}

function priceProductLine(product, quantity = 1) {
  const qty = Number(quantity) > 0 ? Number(quantity) : 1;
  const mainPrice = Number(product?.mainPrice) || 0;
  const unit = unitPrice(product);
  const lineMain = mainPrice * qty;
  const lineTotal = unit * qty;
  return {
    quantity: qty,
    mainPrice,
    unitPrice: unit,
    lineMain: Number(lineMain.toFixed(2)),
    lineTotal: Number(lineTotal.toFixed(2)),
    productDiscount: Number((lineMain - lineTotal).toFixed(2)),
  };
}

function priceCart(cart) {
  const items = (cart?.items || []).map((item) => {
    const priced = priceProductLine(item.product, item.quantity);
    return {
      product: item.product,
      ...priced,
    };
  });

  const combos = (cart?.combos || []).map((comboItem) => {
    const combo = comboItem.combo;
    const products = combo?.productIds || [];
    const priced = priceCombo(products, combo?.comboDiscountPercentage, comboItem.quantity);
    return {
      combo,
      ...priced,
    };
  });

  const itemsTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const combosTotal = combos.reduce((sum, combo) => sum + combo.total, 0);
  const itemsMain = items.reduce((sum, item) => sum + item.lineMain, 0);
  const combosMain = combos.reduce((sum, combo) => sum + combo.subtotalMain, 0);
  const comboDiscount = combos.reduce((sum, combo) => sum + combo.comboDiscount, 0);
  const productDiscount = items.reduce((sum, item) => sum + item.productDiscount, 0);
  const total = Number((itemsTotal + combosTotal).toFixed(2));
  const subtotalMain = Number((itemsMain + combosMain).toFixed(2));

  return {
    items,
    combos,
    subtotalMain,
    productDiscount: Number(productDiscount.toFixed(2)),
    comboDiscount: Number(comboDiscount.toFixed(2)),
    totalDiscount: Number((subtotalMain - total).toFixed(2)),
    total,
    comboApplied: combos.length > 0,
  };
}

module.exports = {
  unitPrice,
  priceCombo,
  priceProductLine,
  priceCart,
};
