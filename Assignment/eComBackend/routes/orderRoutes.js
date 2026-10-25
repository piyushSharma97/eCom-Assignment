const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.post('/:id/pay', orderController.payOrder);
router.get('/:id', orderController.getOrder);

module.exports = router;
