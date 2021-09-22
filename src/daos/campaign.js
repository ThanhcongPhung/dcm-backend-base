const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const Campaign = require('../models/campaign');
const daoUtils = require('./utils');
const serviceDao = require('./service');
const {
  PARTICIPANT_STATUS,
  CAMPAIGN_VISIBILITY,
  SYSTEM_ROLE,
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
  const { status, campaignVisibility, serviceId, participantStatus, user } =
    query;
  let advanceSearch = {};
  if (serviceId) advanceSearch.serviceId = serviceId;
  if (campaignVisibility) advanceSearch.campaignVisibility = campaignVisibility;

  const userId = user._id;
  const userRole = (user.role && user.role.name) || '';

  switch (userRole) {
    case SYSTEM_ROLE.USER: {
      if (participantStatus === PARTICIPANT_STATUS.MY_CAMPAIGN) {
        advanceSearch.participants = { $elemMatch: { userId } };
      } else if (participantStatus === PARTICIPANT_STATUS.OTHER_CAMPAIGN) {
        advanceSearch.participants = {
          $not: { $elemMatch: { userId } },
        };
      }
      advanceSearch = {
        ...advanceSearch,
        status: status || { $ne: CAMPAIGN_STATUS.DRAFT },
        campaignVisibility: CAMPAIGN_VISIBILITY.PUBLIC,
      };
      break;
    }
    case SYSTEM_ROLE.ADMIN: {
      const statusField = status ? { status } : {};
      advanceSearch = { ...advanceSearch, ...statusField };
      break;
    }
    case SYSTEM_ROLE.SERVICE_MANAGER: {
      const serviceSearch = { managers: { $elemMatch: { $eq: userId } } };
      const { services } = await serviceDao.findServices({
        query: serviceSearch,
      });
      const serviceIds = services.map((item) => item._id);
      const serviceIdField = serviceIds.length
        ? { serviceId: { $in: serviceIds } }
        : {};
      const statusField = status ? { status } : {};
      advanceSearch = { ...advanceSearch, ...statusField, ...serviceIdField };
      break;
    }
    default:
      throw new CustomError(codes.UNAUTHORIZED);
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
  const [campaign] = await Campaign.aggregate([
    { $match: condition },
    {
      $lookup: {
        from: 'services',
        localField: 'serviceId',
        foreignField: '_id',
        as: 'service',
      },
    },
    { $unwind: '$service' },
  ]);
  return campaign;
};

const findParticipants = async (condition) => {
  const [campaign] = await Campaign.aggregate([
    { $match: condition },
    { $unwind: '$participants' },
    {
      $lookup: {
        from: 'users',
        localField: 'participants.userId',
        foreignField: '_id',
        as: 'participants.user',
      },
    },
    { $unwind: '$participants.user' },
    {
      $group: {
        _id: '$_id',
        participants: { $push: '$participants' },
      },
    },
  ]);
  return campaign.participants;
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
  findParticipants,
};
