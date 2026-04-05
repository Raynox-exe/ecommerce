const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/admin/stats', authMiddleware, orderController.getAdminStats);
router.get('/admin/all', authMiddleware, orderController.getAllOrders);

module.exports = router;
