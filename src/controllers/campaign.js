const campaignService = require('../services/campaign');
const {
  INTENT_STATUS,
  CAMPAIGN_STATUS,
  CAMPAIGN_ROLE,
} = require('../constants');

const getCampaigns = async (req, res) => {
  const { user } = req;
  const {
    search,
    fields,
    offset,
    limit,
    sort,
    participantStatus,
    campaignVisibility,
    status,
    serviceId,
  } = req.query;

  const query = {};
  query.query = {
    participantStatus,
    campaignVisibility,
    status,
    serviceId,
    user,
  };
  if (search) query.search = search;
  if (fields) query.fields = fields.split(',');
  if (offset) query.offset = parseInt(offset, 10);
  if (limit) query.limit = parseInt(limit, 10);
  if (sort) query.sort = sort.split(',');

  const { campaigns, count } = await campaignService.getCampaigns(query);

  return res.send({
    status: 1,
    result: {
      campaigns,
      metadata: {
        total: count,
      },
    },
  });
};

const getCampaign = async (req, res) => {
  const { campaign } = req;
  let { fields } = req.query;
  if (fields) fields = fields.split(',');
  if (
    campaign.status === CAMPAIGN_STATUS.DRAFT ||
    !fields ||
    !fields.includes('detailCampaign')
  )
    return res.send({ status: 1, result: { ...campaign, detailCampaign: {} } });

  const campaignInfo = await campaignService.getCampaign(campaign);
  return res.send({ status: 1, result: campaignInfo });
};

const createCampaign = async (req, res) => {
  const { _id: userId } = req.user;
  const participants = [{ userId, role: CAMPAIGN_ROLE.OWNER }];
  const campaign = await campaignService.createCampaign({
    ...req.body,
    participants,
  });
  return res.send({ status: 1, result: campaign });
};

const updateCampaign = async (req, res) => {
  const { campaign } = req;
  const newCampaign = await campaignService.updateCampaign(campaign, req.body);

  return res.send({ status: 1, result: newCampaign });
};

const updateServiceCampaign = async (req, res) => {
  const { campaign } = req;
  await campaignService.updateServiceCampaign(campaign, req.body);
  return res.send({ status: 1 });
};

const deleteCampaign = async (req, res) => {
  const { campaign } = req;
  await campaignService.deleteCampaign(campaign._id);
  return res.send({ status: 1 });
};

const joinCampaign = async (req, res) => {
  const { _id: userId } = req.user;
  const { _id: campaignId, participants } = req.campaign;
  const joinResult = await campaignService.joinCampaign(
    userId,
    campaignId,
    participants,
  );
  return res.send({ status: 1, result: joinResult });
};

const leaveCampaign = async (req, res) => {
  const { _id: userId } = req.user;
  const { _id: campaignId, participants } = req.campaign;
  const leaveResult = await campaignService.leaveCampaign(
    userId,
    campaignId,
    participants,
  );
  return res.send({ status: 1, result: leaveResult });
};

const updateStatusCampaign = async (req, res) => {
  const { campaign } = req;
  const { status } = req.body;
  const changeResult = await campaignService.updateStatusCampaign(
    campaign,
    status,
  );
  return res.send({ status: 1, result: changeResult });
};

const getIntents = async (req, res) => {
  const {
    campaign: { _id: campaignId },
  } = req;
  const { search, fields, offset, limit, sort } = req.params;
  const query = {};
  query.query = { campaignId, status: INTENT_STATUS.ACTIVE };
  if (search) query.search = search;
  if (search) query.search = search;
  if (fields) query.fields = fields.split(',');
  if (offset) query.offset = parseInt(offset, 10);
  if (limit) query.limit = parseInt(limit, 10);
  if (sort) query.sort = sort.split(',');

  const { intents, count } = await campaignService.getIntents(query);
  return res.send({
    status: 1,
    result: {
      intents,
      metadata: {
        total: count,
      },
    },
  });
};

const syncIntents = async (req, res) => {
  const {
    campaign: { _id: campaignId, botId },
  } = req;
  await campaignService.syncIntents(campaignId, botId);
  return res.send({ status: 1 });
};

const getParticipants = async (req, res) => {
  const { _id: campaignId, participants } = req.campaign;
  if (!participants.length) return res.send({ status: 1, result: [] });
  const detailParticipants = await campaignService.getParticipants(campaignId);
  return res.send({ status: 1, result: detailParticipants });
};

const addParticipant = async (req, res) => {
  const { _id: campaignId, participants } = req.campaign;
  const { participantId, role } = req.body;
  await campaignService.addParticipant({
    campaignId,
    participants,
    participantId,
    role,
  });
  return res.send({ status: 1 });
};

const deleteParticipant = async (req, res) => {
  const { _id: campaignId, participants } = req.campaign;
  const { participantId } = req.params;
  await campaignService.deleteParticipant(
    campaignId,
    participants,
    participantId,
  );
  return res.send({ status: 1 });
};

const editRoleParticipant = async (req, res) => {
  const { _id: campaignId, participants } = req.campaign;
  const { participantId } = req.params;
  const { role } = req.body;
  await campaignService.editRoleParticipant({
    campaignId,
    participants,
    participantId,
    role,
  });
  return res.send({ status: 1 });
};

module.exports = {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  updateServiceCampaign,
  deleteCampaign,
  joinCampaign,
  leaveCampaign,
  updateStatusCampaign,
  getIntents,
  syncIntents,
  getParticipants,
  addParticipant,
  deleteParticipant,
  editRoleParticipant,
};
