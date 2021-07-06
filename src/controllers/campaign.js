const campaignService = require('../services/campaign');

const getCampaigns = async (req, res) => {
  const { search, fields, offset, limit, sort } = req.query;
  const { campaignVisibility, status, collectDataSystem } = req.body;

  const { campaigns, count } = await campaignService.getCampaigns({
    search,
    fields,
    offset,
    limit,
    sort,
    campaignVisibility,
    status,
    collectDataSystem,
  });
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

module.exports = {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
