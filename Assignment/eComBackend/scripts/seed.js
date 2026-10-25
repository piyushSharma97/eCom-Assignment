require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Products');
const Combo = require('../models/Combo');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerceStore';

const productsData = [
  {
    name: 'Ceramic Pour-Over Mug',
    mainPrice: 899,
    discountedPrice: 749,
    description: '12oz stoneware mug with a built-in dripper. Holds heat and looks good on a desk.',
  },
  {
    name: 'Single-Origin Coffee Pack',
    mainPrice: 649,
    discountedPrice: 549,
    description: '250g of medium-roast beans. Chocolate and orange notes.',
  },
  {
    name: 'Notebook Set',
    mainPrice: 499,
    discountedPrice: null,
    description: 'Two A5 dotted notebooks with a lay-flat stitch binding.',
  },
  {
    name: 'Brass Pen',
    mainPrice: 399,
    discountedPrice: 329,
    description: 'Refillable brass rollerball. Heavy enough to feel like a tool.',
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Product.deleteMany({});
  await Combo.deleteMany({});
  const products = [];
  for (const data of productsData) {
    products.push(await Product.create(data));
  }
  await Combo.create([
    {
      name: 'Morning kit',
      productIds: [products[0]._id, products[1]._id],
      comboDiscountPercentage: 15,
    },
    {
      name: 'Desk kit',
      productIds: [products[2]._id, products[3]._id],
      comboDiscountPercentage: 10,
    },
  ]);
  console.log('Seeded 4 products and 2 combos');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
