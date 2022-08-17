const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { orderController } = require('../controllers');

router.post('/new', auth(), orderController.createOrder);

module.exports = router;