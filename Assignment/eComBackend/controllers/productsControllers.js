const Product = require('../models/Products');

// fetch all the products available
exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
// get product by id
exports.getProductbyID = async (req, res) => {
    try {
        let productId = req.params.id

        const singleProduct = await Product.findById(productId)
        if (!singleProduct) {
            return res.status(404).json({
                message: 'Product not found'
            })

        }
        res.json(singleProduct)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
// Add Product
exports.addProduct = async (req, res) => {

    try {
        const { name, description, mainPrice, discountedPrice } = req.body;
        const picture = req.file ? req.file.path.replace(/\\/g, '/') : '';
        const product = new Product({
            name,
            description,
            mainPrice,
            discountedPrice,
            picture
        });
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, mainPrice, discountedPrice, currentImage } = req.body;
        const picture = req.file ? req.file.path.replace(/\\/g, '/') : currentImage;
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          mainPrice: mainPrice,
          discountedPrice: discountedPrice ? discountedPrice: null,
          picture: picture || undefined 
        },
        { new: true }
      );
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};