const router = require('express').Router();
const user = require('./user');
const products = require('./products');
const auth = require('./auth');
const orders = require('./orders');

router.use('/auth', auth);
router.use('/user', user);
router.use('/products', products);
router.use('/orders', orders);

module.exports = router;
