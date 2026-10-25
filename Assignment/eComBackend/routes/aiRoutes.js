const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/suggest', aiController.suggest);

module.exports = router;
