const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const intentDao = require('../daos/intent');
const serviceDao = require('../daos/service');
const campaignDao = require('../daos/campaign');
const botService = require('./bot');
const roleDao = require('../daos/role');
const serviceCampaign = require('./serviceCampaign');
const { CAMPAIGN_STATUS, CAMPAIGN_USER_ROLE } = require('../constants');

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

const getCampaign = async (campaign) => {
  const response = await serviceCampaign.getServiceCampaign(
    campaign._id,
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
    participants: [],
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

const updateCampaign = async (campaign, updateFields) => {
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

  if (botId && botId !== campaign.botId) {
    await intentDao.deleteIntents({ campaignId: campaign._id });
    const { result } = await botService.getIntents(botId);
    const intents = result.intents.map((item) => {
      return { ...item, campaignId: campaign._id };
    });
    await intentDao.createIntents(intents);
  }

  const newCampaign = await campaignDao.updateCampaign(campaign._id, {
    name,
    description,
    campaignVisibility,
    image,
    startTime,
    endTime,
    appId,
    botId,
  });
  return newCampaign;
};

const updateServiceCampaign = async (campaign, detailCampaign) => {
  const result = await serviceCampaign.updateServiceCampaign(
    campaign._id,
    campaign.service.url,
    detailCampaign,
  );
  if (!result.status) {
    throw new Error('Update failure');
  }

  const newCampaign = await campaignDao.updateCampaign(campaign._id, {
    status:
      campaign.status === CAMPAIGN_STATUS.DRAFT
        ? CAMPAIGN_STATUS.WAITING
        : campaign.status,
  });
  return newCampaign;
};

const deleteCampaign = async (campaignId) => {
  await intentDao.deleteIntents({ campaignId });
  await campaignDao.deleteCampaign(campaignId);
};

const joinCampaign = async (user, campaign) => {
  const role = await roleDao.findRole({ name: CAMPAIGN_USER_ROLE.USER });
  if (!role) throw new CustomError(code.BAD_REQUEST, 'Role is not exists');

  let { participants } = campaign;
  const hasJoined = participants.some(
    (item) => String(item.user) === String(user._id),
  );
  if (hasJoined) throw new CustomError(code.BAD_REQUEST, 'User joined');
  participants = [...participants, { user: user._id, role: role._id }];

  const joinResult = await campaignDao.updateCampaign(campaign._id, {
    participants,
  });

  return joinResult;
};

const leaveCampaign = async (user, campaign) => {
  let { participants } = campaign;
  const hasJoined = participants.some(
    (item) => String(item.user) === String(user._id),
  );
  if (!hasJoined)
    throw new CustomError(code.BAD_REQUEST, 'User has not joined');
  participants = participants.filter(
    (item) => String(item.user) !== String(user._id),
  );

  const result = await campaignDao.updateCampaign(campaign._id, {
    participants,
  });
  return result;
};

module.exports = {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  updateServiceCampaign,
  deleteCampaign,
  joinCampaign,
  leaveCampaign,
};
