const { CAMPAIGN_STATUS } = require('../constants');
const campaignDao = require('../daos/campaign');

const createCampaign = async (createFields) => {
  const campaign = await campaignDao.createCampaign({
    ...createFields,
    status: CAMPAIGN_STATUS.WAITING,
  });
  return campaign;
};

module.exports = {
  createCampaign,
};
