const fs = require('fs');
const path = require('path');
const Product = require('../models/Products');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductbyID = async (req, res) => {
  try {
    const singleProduct = await Product.findById(req.params.id);
    if (!singleProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(singleProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, mainPrice, discountedPrice } = req.body;
    const picture = req.file ? req.file.filename : '';
    const product = new Product({
      name,
      description,
      mainPrice,
      discountedPrice: discountedPrice || undefined,
      picture,
    });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, mainPrice, discountedPrice, currentImage } = req.body;
    const picture = req.file ? req.file.filename : currentImage;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        mainPrice,
        discountedPrice: discountedPrice ? discountedPrice : null,
        picture: picture || undefined,
      },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (product.picture) {
      const filePath = path.join(__dirname, '..', 'uploads', path.basename(product.picture));
      fs.unlink(filePath, () => {});
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
