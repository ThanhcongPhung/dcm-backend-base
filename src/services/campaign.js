const { CAMPAIGN_STATUS } = require('../constants');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const campaignDao = require('../daos/campaign');

const getCampaigns = async ({
  search,
  fields,
  offset,
  limit,
  sort,
  status,
  campaignVisibility,
  collectDataSystem,
}) => {
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

  const { campaigns, count } = await campaignDao.findCampaigns(query);
  return { campaigns, count };
};

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
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
