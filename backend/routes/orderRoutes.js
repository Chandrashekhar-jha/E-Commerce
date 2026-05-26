const express = require('express');
const {protect} = require('../middleware/authMiddleware');
const {createOrder, getOrders, getMyOrdersById, updateOrderStatus, deleteOrder} = require('../controllers/orderController');
const {admin} = require('../middleware/adminMiddleware');

const router = express.Router();

// Admin routes
router.route('/').get(protect, admin, getOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id').delete(protect, admin, deleteOrder);

// User routes
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrdersById);
router.route('/myorders/:orderId').get(protect, getMyOrdersById);

module.exports = router;
