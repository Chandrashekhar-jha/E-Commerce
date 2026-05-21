const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getAnalytics } = require('../controllers/analyticsController.js');

const router = express.Router();

router.get('/', protect, admin, getAnalytics);

module.exports = router;