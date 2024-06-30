const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCart);
router.post('/add', cartController.addItemToCart);
router.post('/addCombo', cartController.addComboItems);
router.post('/removeCombo', cartController.removeComboFromCart);
router.post('/remove', cartController.removeItemFromCart);
router.get('/total', cartController.calculateCartTotal);

module.exports = router;
