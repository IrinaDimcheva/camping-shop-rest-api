const router = require('express').Router();
const user = require('./user');
const products = require('./products');
const likes = require('./likes');
const favorites = require('./favorites');
const auth = require('./auth');

router.use('/auth', auth);
router.use('/user', user);
router.use('/products', products);
router.use('/likes', likes);
router.use('/favorites', favorites);

module.exports = router;
