const express = require('express');
const { uploadPicture } = require('../middleware/uploadPicture');
const productsControllers = require('../controllers/productsControllers');

const router = express.Router();

router.get('/', productsControllers.getAllProducts);
router.get('/:id', productsControllers.getProductbyID);
router.post('/', uploadPicture, productsControllers.addProduct);
router.post('/addproduct', uploadPicture, productsControllers.addProduct);
router.patch('/:id', uploadPicture, productsControllers.updateProduct);
router.delete('/:id', productsControllers.deleteProduct);

module.exports = router;
