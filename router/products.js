const express = require('express');
const router = express.Router();
const { auth, admin } = require('../utils');
const { productController, commentController } = require('../controllers');

router.get('/', productController.getProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.post('/new', auth(), admin(), productController.createProduct);

router.get('/:productId', productController.getProduct);
router.delete('/:productId', auth(), admin(), productController.deleteProduct);
router.put('/:productId', auth(), admin(), productController.updateProduct);
router.post('/:productId/comments', auth(), commentController.createComment);
router.get('/:productId/comments', commentController.getComments);
router.get('/:productId/comments/:commentId', auth(), commentController.getComment);
router.put('/:productId/comments/:commentId', auth(), commentController.editComment);
router.delete('/:productId/comments/:commentId', auth(), commentController.deleteComment);

module.exports = router;
