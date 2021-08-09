const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const intentController = require('../controllers/intent');

router.put('/intents', asyncMiddleware(intentController.syncIntents));

module.exports = router;
