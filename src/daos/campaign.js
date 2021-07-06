const Campaign = require('../models/campaign');
const daoUtils = require('./utils');

const findCampaigns = async ({
  search,
  query,
  offset,
  limit,
  fields,
  sort,
}) => {
  const { documents: campaigns, count } = await daoUtils.findAll(
    Campaign,
    ['name'],
    {
      search,
      query,
      offset,
      limit,
      fields,
      sort,
    },
  );
  return { campaigns, count };
};

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
  findCampaigns,
  findCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
