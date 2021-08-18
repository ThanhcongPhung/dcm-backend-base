const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const userDao = require('../daos/user');
const intentDao = require('../daos/intent');
const serviceDao = require('../daos/service');
const campaignDao = require('../daos/campaign');
const botService = require('./bot');
const serviceCampaign = require('./serviceCampaign');
const {
  PARTICIPATION_STATUS,
  EVENT_JOIN_CAMPAIGN,
  CAMPAIGN_STATUS,
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

  const response = await serviceCampaign.getServiceCampaign(
    campaignId,
    campaign.service.url,
  );
  if (!response.status) {
    throw new Error('Campaign is not exists');
  }
  return { ...campaign, detailCampaign: response.result };
};

const createCampaign = async ({
  name,
  description,
  campaignVisibility,
  image,
  startTime,
  endTime,
  serviceId,
  action,
  appId,
  botId,
}) => {
  const service = await serviceDao.findService(serviceId);
  if (!service)
    throw new CustomError(code.BAD_REQUEST, 'Service is not exists');
  const actionExist = service.actions.find((item) => item === action);
  if (!actionExist)
    throw new CustomError(
      code.BAD_REQUEST,
      'Service does not have this action',
    );
  const campaign = await campaignDao.createCampaign({
    name,
    description,
    campaignVisibility,
    image,
    startTime,
    endTime,
    service: serviceId,
    action,
    appId,
    botId,
    status: CAMPAIGN_STATUS.DRAFT,
  });
  if (botId) {
    const response = await botService.getIntents(botId);
    if (response.status && response.result.intents.length) {
      const intents = response.result.intents.map((item) => {
        return { ...item, campaignId: campaign.id };
      });
      await intentDao.createIntents(intents);
    }
  }
  return campaign;
};

const updateCampaign = async (campaignId, updateFields) => {
  const {
    name,
    description,
    campaignVisibility,
    image,
    startTime,
    endTime,
    appId,
    botId,
  } = updateFields;

  const campaignExist = await campaignDao.findCampaign(campaignId);
  if (!campaignExist)
    throw new CustomError(code.BAD_REQUEST, 'Campaign is not exists');

  if (botId && botId !== campaignExist.botId) {
    await intentDao.deleteIntents({ campaignId });
    const { result } = await botService.getIntents(botId);
    const intents = result.intents.map((item) => {
      return { ...item, campaignId };
    });
    if (intents.length) await intentDao.createIntents(intents);
  }

  const campaign = await campaignDao.updateCampaign(campaignId, {
    name,
    description,
    campaignVisibility,
    image,
    startTime,
    endTime,
    appId,
    botId,
  });
  return campaign;
};

const updateServiceCampaign = async (campaignId, detailCampaign) => {
  const campaignExist = await campaignDao.findCampaign(campaignId);
  if (!campaignExist)
    throw new CustomError(code.BAD_REQUEST, 'Campaign is not exists');

  const result = await serviceCampaign.updateServiceCampaign(
    campaignId,
    campaignExist.service.url,
    detailCampaign,
  );
  if (!result.status) {
    throw new Error('Update failure');
  }

  const campaign = await campaignDao.updateCampaign(campaignId, {
    status:
      campaignExist.status === CAMPAIGN_STATUS.DRAFT
        ? CAMPAIGN_STATUS.WAITING
        : campaignExist.status,
  });
  return campaign;
};

const deleteCampaign = async (campaignId) => {
  const campaignExist = await campaignDao.findCampaign(campaignId);
  if (!campaignExist)
    throw new CustomError(code.BAD_REQUEST, 'Campaign is not exists');
  await intentDao.deleteIntents({ campaignId });
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
  updateServiceCampaign,
  deleteCampaign,
  addUser,
};
