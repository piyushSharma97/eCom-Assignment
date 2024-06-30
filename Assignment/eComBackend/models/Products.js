const mongoose = require('mongoose');
// generate unique sku for product which can be show on frontend 
const generateSKU = async (ProductModel) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const getRandomAlpha = () => alphabet[Math.floor(Math.random() * alphabet.length)];
    const getRandomNumber = () => Math.floor(Math.random() * 10);
    
    let sku;
    let skuExists = true;
    
    // Loop until a unique SKU is generated
    while (skuExists) {
        sku = `${getRandomAlpha()}${getRandomAlpha()}${getRandomAlpha()}${getRandomNumber()}${getRandomNumber()}${getRandomNumber()}`;
        skuExists = await ProductModel.exists({ sku });
    }
    
    return sku;
};
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mainPrice:{
        type:Number,
        required:true
    },
    discountedPrice:{
        type:Number,
    },
    description: { type: String },
    picture: { type: String },
    sku: {
        type: String,
        unique: true
    }
}, { timestamps: true })

productSchema.pre('save', async function (next) {
    if (!this.sku) {
        this.sku = await generateSKU(mongoose.model('Product'));
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);