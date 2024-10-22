const express = require('express');
const router = express.Router();
const weatherController = require('../controller/weatherController');


router.get('/current/:city?', weatherController.getCurrentWeather);
router.get('/hourly/:city?', weatherController.getHourlyForecast);
router.get('/daily/:city?', weatherController.getDailyForecast);
router.get('/ten-day/:city?', weatherController.getTenDayForecast);
router.get('/cities/:query', weatherController.searchCities);

module.exports = router;