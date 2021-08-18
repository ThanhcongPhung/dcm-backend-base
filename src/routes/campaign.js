const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const campaignController = require('../controllers/campaign');
const {
  createCampaignValidate,
  userJoinValidate,
  updateCampaignValidate,
  updateServiceValidate,
} = require('../validations/campaign');

/* eslint-disable prettier/prettier */
router.get('/campaigns', asyncMiddleware(campaignController.getCampaigns));
router.get('/campaigns/:campaignId', asyncMiddleware(campaignController.getCampaign));
router.post('/campaigns', createCampaignValidate, asyncMiddleware(campaignController.createCampaign));
router.delete('/campaigns/:campaignId', asyncMiddleware(campaignController.deleteCampaign));
router.put('/campaigns/:campaignId/add-user', userJoinValidate, asyncMiddleware(campaignController.addUser));

router.put('/campaigns/:campaignId', updateCampaignValidate, asyncMiddleware(campaignController.updateCampaign));
router.put('/campaigns/:campaignId/service', updateServiceValidate, asyncMiddleware(campaignController.updateServiceCampaign));
/* eslint-enable prettier/prettier */

module.exports = router;
