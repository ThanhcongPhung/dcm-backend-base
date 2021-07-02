const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const campaignController = require('../controllers/campaign');
const { campaignValidate } = require('../validations/campaign');

/* eslint-disable prettier/prettier */
router.post('/campaigns', campaignValidate, asyncMiddleware(campaignController.createCampaign));
/* eslint-enable prettier/prettier */

module.exports = router;
