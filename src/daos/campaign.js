const Campaign = require('../models/campaign');

const createCampaign = async (createFields) => {
  const campaign = await Campaign.create(createFields);
  return campaign;
};

module.exports = {
  createCampaign,
};
