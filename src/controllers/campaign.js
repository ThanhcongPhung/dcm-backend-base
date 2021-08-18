const campaignService = require('../services/campaign');

const getCampaigns = async (req, res) => {
  const {
    search,
    fields,
    offset,
    limit,
    sort,
    campaignVisibility,
    status,
    serviceId: service,
  } = req.query;

  const query = {};

  const statusFilter = status ? { status } : {};
  const campaignVisibilityFilter = campaignVisibility
    ? { campaignVisibility }
    : {};
  const serviceFilter = service ? { service } : {};

  query.query = {
    ...statusFilter,
    ...campaignVisibilityFilter,
    ...serviceFilter,
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
  const { campaignId } = req.params;
  const campaign = await campaignService.getCampaign(campaignId);
  return res.send({ status: 1, result: campaign });
};

const createCampaign = async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body);
  return res.send({ status: 1, result: campaign });
};

const updateCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const campaign = await campaignService.updateCampaign(campaignId, req.body);

  return res.send({ status: 1, result: campaign });
};

const updateServiceCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const campaign = await campaignService.updateServiceCampaign(
    campaignId,
    req.body,
  );
  return res.send({ status: 1, result: campaign });
};

const deleteCampaign = async (req, res) => {
  const { campaignId } = req.params;
  await campaignService.deleteCampaign(campaignId);
  return res.send({ status: 1 });
};

const addUser = async (req, res) => {
  const { campaignId } = req.params;
  const { userId, event } = req.body;
  const joinResult = await campaignService.addUser(userId, campaignId, event);
  return res.send({ status: 1, result: joinResult });
};

module.exports = {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  updateServiceCampaign,
  deleteCampaign,
  addUser,
};
