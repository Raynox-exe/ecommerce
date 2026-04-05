const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/search', productController.getProductsBySearch);
router.get('/:id', productController.getProductById);
router.get('/category/:categoryId', productController.getProductsByCategory);

module.exports = router;
