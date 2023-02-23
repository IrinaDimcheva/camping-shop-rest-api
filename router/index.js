const router = require('express').Router();
const user = require('./user');
const products = require('./products');
const likes = require('./likes');
const auth = require('./auth');
const orders = require('./orders');

router.use('/auth', auth);
router.use('/user', user);
router.use('/products', products);
router.use('/orders', orders);
router.use('/likes', likes);
router.use('/favorites', favorites);

module.exports = router;
