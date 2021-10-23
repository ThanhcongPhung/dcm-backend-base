const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const statisticController = require('../controllers/statistic');
const { auth } = require('../middlewares/auth');

/* eslint-disable prettier/prettier */
router.post('/overviews', auth,  asyncMiddleware(statisticController.getOverview));
/* eslint-enable prettier/prettier */

module.exports = router;
