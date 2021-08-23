const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const campaignController = require('../controllers/campaign');
const getCampaign = require('../middlewares/getCampaign');
const { auth } = require('../middlewares/auth');

const {
  createCampaignValidate,
  updateCampaignValidate,
  updateServiceValidate,
  updateStatusValidate,
} = require('../validations/campaign');

/* eslint-disable prettier/prettier */
router.get('/campaigns', auth, asyncMiddleware(campaignController.getCampaigns));
router.get('/campaigns/:campaignId', getCampaign, asyncMiddleware(campaignController.getCampaign));
router.post('/campaigns', createCampaignValidate, asyncMiddleware(campaignController.createCampaign));
router.delete('/campaigns/:campaignId', getCampaign, asyncMiddleware(campaignController.deleteCampaign));

router.post('/campaigns/join', auth, getCampaign, asyncMiddleware(campaignController.joinCampaign));
router.post('/campaigns/leave', auth, getCampaign, asyncMiddleware(campaignController.leaveCampaign));
router.put('/campaigns/service', getCampaign, updateServiceValidate, asyncMiddleware(campaignController.updateServiceCampaign));
router.put('/campaigns/status', getCampaign, updateStatusValidate, asyncMiddleware(campaignController.updateStatusCampaign));
router.put('/campaigns/:campaignId', getCampaign, updateCampaignValidate, asyncMiddleware(campaignController.updateCampaign));
/* eslint-enable prettier/prettier */

module.exports = router;
