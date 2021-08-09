const campaignService = require('../services/campaign');

const getCampaigns = async (req, res) => {
  const { search, fields, offset, limit, sort } = req.query;
  const { campaignVisibility, status, collectDataSystem } = req.body;

  const query = {};

  const statusFilter = status ? { status } : {};
  const campaignVisibilityFilter = campaignVisibility
    ? { campaignVisibility }
    : {};
  const collectDataSystemFilter = collectDataSystem
    ? { collectDataSystem }
    : {};

  query.query = {
    ...statusFilter,
    ...campaignVisibilityFilter,
    ...collectDataSystemFilter,
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
  const createFields = req.body;
  const campaign = await campaignService.createCampaign(createFields);
  return res.send({ status: 1, result: campaign });
};

const updateCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const updateFields = req.body;
  const campaign = await campaignService.updateCampaign(
    campaignId,
    updateFields,
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
  deleteCampaign,
  addUser,
};
