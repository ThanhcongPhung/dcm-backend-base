const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const botController = require('../controllers/bot');

router.get('/apps/:appId', asyncMiddleware(botController.getApp));
router.get('/intents', asyncMiddleware(botController.getIntents));

module.exports = router;
