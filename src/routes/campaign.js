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
  participantValidate,
} = require('../validations/campaign');

/* eslint-disable prettier/prettier */
router.get('/campaigns', auth, asyncMiddleware(campaignController.getCampaigns));
router.get('/campaigns/intents', getCampaign, asyncMiddleware(campaignController.getIntents));
router.get('/campaigns/participants', auth, getCampaign, asyncMiddleware(campaignController.getParticipants));
router.get('/campaigns/:campaignId', getCampaign, asyncMiddleware(campaignController.getCampaign));
router.post('/campaigns',auth, createCampaignValidate, asyncMiddleware(campaignController.createCampaign));
router.delete('/campaigns/:campaignId', getCampaign, asyncMiddleware(campaignController.deleteCampaign));

router.post('/campaigns/join', auth, getCampaign, asyncMiddleware(campaignController.joinCampaign));
router.post('/campaigns/leave', auth, getCampaign, asyncMiddleware(campaignController.leaveCampaign));
router.put('/campaigns/service', getCampaign, updateServiceValidate, asyncMiddleware(campaignController.updateServiceCampaign));
router.put('/campaigns/status', getCampaign, updateStatusValidate, asyncMiddleware(campaignController.updateStatusCampaign));
router.put('/campaigns/intents', auth, getCampaign, asyncMiddleware(campaignController.syncIntents));
router.put('/campaigns/:campaignId', getCampaign, updateCampaignValidate, asyncMiddleware(campaignController.updateCampaign));

router.post('/participants', auth, getCampaign, participantValidate, asyncMiddleware(campaignController.addParticipant));
router.delete('/participants/:participantId', auth, getCampaign, asyncMiddleware(campaignController.deleteParticipant));
router.put('/participants/:participantId', auth, getCampaign, participantValidate, asyncMiddleware(campaignController.editRoleParticipant));
/* eslint-enable prettier/prettier */

module.exports = router;
