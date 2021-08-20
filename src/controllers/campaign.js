const campaignService = require('../services/campaign');

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
    service: serviceId,
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
  const campaignInfo = await campaignService.getCampaign(campaign);
  return res.send({ status: 1, result: campaignInfo });
};

const createCampaign = async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body);
  return res.send({ status: 1, result: campaign });
};

const updateCampaign = async (req, res) => {
  const { campaign } = req;
  const newCampaign = await campaignService.updateCampaign(campaign, req.body);

  return res.send({ status: 1, result: newCampaign });
};

const updateServiceCampaign = async (req, res) => {
  const { campaign } = req;
  const newCampaign = await campaignService.updateServiceCampaign(
    campaign,
    req.body,
  );
  return res.send({ status: 1, result: newCampaign });
};

const deleteCampaign = async (req, res) => {
  const { campaign } = req;
  await campaignService.deleteCampaign(campaign._id);
  return res.send({ status: 1 });
};

const joinCampaign = async (req, res) => {
  const { campaign, user } = req;
  const joinResult = await campaignService.joinCampaign(user, campaign);
  return res.send({ status: 1, result: joinResult });
};

const leaveCampaign = async (req, res) => {
  const { campaign, user } = req;
  const leaveResult = await campaignService.leaveCampaign(user, campaign);
  return res.send({ status: 1, result: leaveResult });
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
};
