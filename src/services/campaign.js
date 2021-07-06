const { CAMPAIGN_STATUS } = require('../constants');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const campaignDao = require('../daos/campaign');

const createCampaign = async (createFields) => {
  const campaign = await campaignDao.createCampaign({
    ...createFields,
    status: CAMPAIGN_STATUS.WAITING,
  });
  return campaign;
};

const updateCampaign = async (campaignId, updateFields) => {
  const campaignExist = await campaignDao.findCampaign(campaignId);

  if (!campaignExist)
    throw new CustomError(code.BAD_REQUEST, 'Campaign is not exists');

  const campaign = await campaignDao.updateCampaign(campaignId, updateFields);
  return campaign;
};

const deleteCampaign = async (campaignId) => {
  const campaignExist = await campaignDao.findCampaign(campaignId);
  if (!campaignExist)
    throw new CustomError(code.BAD_REQUEST, 'Campaign is not exists');

  await campaignDao.deleteCampaign(campaignId);
};

module.exports = {
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
