const express = require('express');
const upload = require('../middleware/multer')
const {getAllProducts,getProductbyID,addProduct} = require('../controllers/productsControllers');
const productsControllers = require('../controllers/productsControllers');
const router = express.Router()


router.get('/',productsControllers.getAllProducts)

router.get('/:id',productsControllers.getProductbyID)

router.post('/addproduct', upload.single('picture'),productsControllers.addProduct)
router.patch('/:id', upload.single('picture'), productsControllers.updateProduct);
router.delete('/:id', productsControllers.deleteProduct);
module.exports = router;