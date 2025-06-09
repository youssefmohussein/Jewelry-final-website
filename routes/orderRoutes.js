const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/orderControllers');

router.get('/order', orderControllers.renderOrderPage);
router.post('/order', orderControllers.createOrder);

module.exports = router;
