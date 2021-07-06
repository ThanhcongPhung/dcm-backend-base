const campaignService = require('../services/campaign');

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

module.exports = {
  createCampaign,
  updateCampaign,
};
