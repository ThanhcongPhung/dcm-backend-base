const { ObjectId } = require('mongoose').Types;
const Campaign = require('../models/campaign');
const daoUtils = require('./utils');
const {
  PARTICIPANT_STATUS,
  CAMPAIGN_VISIBILITY,
  CAMPAIGN_USER_ROLE,
  CAMPAIGN_STATUS,
} = require('../constants');

const findCampaigns = async ({
  search,
  query,
  offset,
  limit,
  fields,
  sort,
}) => {
  const { status, campaignVisibility, service, participantStatus, user } =
    query;
  let advanceSearch = {};
  if (service) advanceSearch.service = service;
  if (campaignVisibility) advanceSearch.campaignVisibility = campaignVisibility;

  if (user.role.name === CAMPAIGN_USER_ROLE.USER) {
    if (participantStatus === PARTICIPANT_STATUS.MY_CAMPAIGN) {
      advanceSearch.participants = { $elemMatch: { user: user._id } };
    } else if (participantStatus === PARTICIPANT_STATUS.OTHER_CAMPAIGN) {
      advanceSearch.participants = {
        $not: { $elemMatch: { user: user._id } },
      };
    }
    advanceSearch = {
      ...advanceSearch,
      status: status || { $ne: CAMPAIGN_STATUS.DRAFT },
      campaignVisibility: CAMPAIGN_VISIBILITY.PUBLIC,
    };
  } else if (user.role.name === CAMPAIGN_USER_ROLE.ADMIN) {
    const statusField = status ? { status } : {};
    advanceSearch = { ...advanceSearch, ...statusField };
  }

  const { documents: campaigns, count } = await daoUtils.findAll(
    Campaign,
    ['name'],
    {
      search,
      query: advanceSearch,
      offset,
      limit,
      fields,
      sort,
    },
  );
  return { campaigns, count };
};

const findCampaign = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const campaign = await Campaign.findById(condition)
      .lean()
      .populate('service')
      .populate('participants.user')
      .populate('participants.role')
      .exec();
    return campaign;
  }

  if (typeof condition === 'object' && condition !== null) {
    const campaign = await Campaign.findOne(condition)
      .lean()
      .populate('service')
      .populate('participants.user')
      .populate('participants.role')
      .exec();
    return campaign;
  }
  throw new Error('Invalid query');
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
