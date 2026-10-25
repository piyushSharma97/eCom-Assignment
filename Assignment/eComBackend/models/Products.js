const mongoose = require('mongoose');

const generateSKU = async (ProductModel) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const getRandomAlpha = () => alphabet[Math.floor(Math.random() * alphabet.length)];
  const getRandomNumber = () => Math.floor(Math.random() * 10);

  let sku;
  let skuExists = true;

  while (skuExists) {
    sku = `${getRandomAlpha()}${getRandomAlpha()}${getRandomAlpha()}${getRandomNumber()}${getRandomNumber()}${getRandomNumber()}`;
    skuExists = await ProductModel.exists({ sku });
  }

  return sku;
};

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mainPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },
    description: { type: String },
    picture: { type: String },
    sku: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

productSchema.pre('save', async function () {
  if (!this.sku) {
    this.sku = await generateSKU(this.constructor);
  }
});

module.exports = mongoose.model('Product', productSchema);
