const { CAMPAIGN_STATUS } = require('../constants');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const userDao = require('../daos/user');
const campaignDao = require('../daos/campaign');
const {
  PARTICIPATION_STATUS,
  EVENT_JOIN_CAMPAIGN,
} = require('../constants/index');

const getCampaigns = async ({ search, fields, offset, limit, sort, query }) => {
  const { campaigns, count } = await campaignDao.findCampaigns({
    search,
    fields,
    offset,
    limit,
    sort,
    query,
  });
  return { campaigns, count };
};

const getCampaign = async (campaignId) => {
  const campaign = await campaignDao.findCampaign(campaignId);
  if (!campaign)
    throw new CustomError(code.BAD_REQUEST, 'Campaign is not exists');

  return campaign;
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

const addUser = async (userId, campaignId, event) => {
  const campaign = await campaignDao.findCampaign({ _id: campaignId });
  if (!campaign)
    throw new CustomError(code.BAD_REQUEST, 'Campaign is not exists');

  const user = await userDao.findUser({ _id: userId });
  if (!user) throw new CustomError(code.BAD_REQUEST, 'User is not exists');
  const joinedUser = campaign.participants.find(
    (parItem) => parItem.user === userId,
  );
  if (!joinedUser && event === EVENT_JOIN_CAMPAIGN.ACCEPT_INVITE)
    throw new CustomError(code.BAD_REQUEST, 'You are not invited');
  if (joinedUser && joinedUser.status === PARTICIPATION_STATUS.JOINED)
    throw new CustomError(code.BAD_REQUEST, 'User joined');

  let { participants } = campaign;
  if (event === EVENT_JOIN_CAMPAIGN.JOIN) {
    participants = [
      ...campaign.participants,
      { user: userId, status: PARTICIPATION_STATUS.JOINED },
    ];
  }
  if (event === EVENT_JOIN_CAMPAIGN.ACCEPT_INVITE) {
    const index = campaign.participants.findIndex(
      (item) => item.user === userId,
    );
    campaign.participants[index] = {
      user: userId,
      status: PARTICIPATION_STATUS.JOINED,
    };
  }
  const joinResult = await campaignDao.updateCampaign(campaignId, {
    participants,
  });

  return joinResult;
};

module.exports = {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  addUser,
};
