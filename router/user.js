const express = require('express');
const router = express.Router();
const { authController, userController } = require('../controllers');
const { auth } = require('../utils');

router.get('/favorites', auth(), userController.getFavorites);
router.post('/favorites/add', auth(), userController.addToFavorites);
router.post('/favorites/remove', auth(), userController.removeFromFavorites);
router.get('/cart', auth(), userController.getCart);
router.post('/cart/add', auth(), userController.addToCart);
router.post('/cart/remove', auth(), userController.removeFromCart);
router.get('/profile', auth(), authController.getProfileInfo);
router.put('/profile', auth(), authController.editProfileInfo);

module.exports = router;