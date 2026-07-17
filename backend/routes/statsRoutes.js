const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');

// Public route to get home page stats
router.get('/', getStats);

module.exports = router;
