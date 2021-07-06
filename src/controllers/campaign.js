const campaignService = require('../services/campaign');

const createCampaign = async (req, res) => {
  const createFields = req.body;
  const campaign = await campaignService.createCampaign(createFields);
  return res.send({ status: 1, result: campaign });
};

module.exports = {
  createCampaign,
};
