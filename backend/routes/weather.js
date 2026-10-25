const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const authMiddleware = require('../middleware/auth');

// Weather routes (protected - require authentication)
router.get('/current', authMiddleware, weatherController.getCurrentWeather);
router.get('/forecast', authMiddleware, weatherController.getForecast);

module.exports = router;
