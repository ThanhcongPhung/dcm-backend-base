const Campaign = require('../models/campaign');
const daoUtils = require('./utils');

const findCampaign = async (condition) => {
  const campaign = await daoUtils.findOne(Campaign, condition);
  return campaign;
};

const createCampaign = async (createFields) => {
  const campaign = await Campaign.create(createFields);
  return campaign;
};

const updateCampaign = async (id, updateFields) => {
  const campaign = await Campaign.findByIdAndUpdate(id, updateFields, {
    new: true,
  });
  return campaign;
};

const deleteCampaign = async (campaignId) => {
  await Campaign.findByIdAndDelete(campaignId);
};

module.exports = {
  findCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
