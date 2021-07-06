const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const campaignController = require('../controllers/campaign');
const { createCampaignValidate } = require('../validations/campaign');

/* eslint-disable prettier/prettier */
router.post('/campaigns', createCampaignValidate, asyncMiddleware(campaignController.createCampaign));
router.put('/campaigns/:campaignId', asyncMiddleware(campaignController.updateCampaign));
router.delete('/campaigns/:campaignId', asyncMiddleware(campaignController.deleteCampaign));
/* eslint-enable prettier/prettier */

module.exports = router;
