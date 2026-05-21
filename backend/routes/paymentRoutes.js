const express = require('express');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController.js');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;