const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const intentDao = require('../daos/intent');
const serviceDao = require('../daos/service');
const campaignDao = require('../daos/campaign');
const botService = require('./bot');
const roleDao = require('../daos/role');
const userDao = require('../daos/user');
const serviceCampaign = require('./serviceCampaign');
const { CAMPAIGN_STATUS, INTENT_STATUS, SYSTEM_ROLE } = require('../constants');

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
  if (!campaign.service || !campaign.service.url)
    throw new CustomError(code.BAD_REQUEST, 'url of service is not exists');

  const response = await serviceCampaign.getServiceCampaign(
    campaign._id,
    campaign.service.url,
  );
  if (!response.status)
    throw new CustomError(code.BAD_REQUEST, 'Campaign is not exists');

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
  campaignType,
  appId,
  botId,
}) => {
  const service = await serviceDao.findService(serviceId);
  if (!service)
    throw new CustomError(code.BAD_REQUEST, 'Service is not exists');
  const actionExist = service.actions.find((item) => item === action);
  if (!actionExist)
    throw new CustomError(code.BAD_REQUEST, 'action is invalid');
  const typeExist = service.campaignTypes.find((item) => item === campaignType);
  if (!typeExist)
    throw new CustomError(code.BAD_REQUEST, 'campaign type is invalid');

  const campaign = await campaignDao.createCampaign({
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
    campaignType,
    participants: [],
    status: CAMPAIGN_STATUS.DRAFT,
  });
  if (botId) {
    const SMDIntents = await botService.getIntents(botId);
    const intents = SMDIntents.map((item) => {
      return {
        ...item,
        campaignId: campaign.id,
        intentId: item.id,
        status: INTENT_STATUS.ACTIVE,
      };
    });
    await intentDao.createIntents(intents);
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
    const SMDIntents = await botService.getIntents(botId);
    const intents = SMDIntents.map((item) => {
      return {
        ...item,
        campaignId: campaign._id,
        intentId: item.id,
        status: INTENT_STATUS.ACTIVE,
      };
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
  if (!campaign.service || (campaign.service && !campaign.service.url))
    throw new CustomError(code.BAD_REQUEST, 'Service is not exists');

  const result = await serviceCampaign.updateServiceCampaign(
    campaign._id,
    campaign.service.url,
    detailCampaign,
  );
  if (!result.status) throw new CustomError(code.BAD_REQUEST, 'Update failure');
  if (campaign.status === CAMPAIGN_STATUS.DRAFT)
    await campaignDao.updateCampaign(campaign._id, {
      status: CAMPAIGN_STATUS.WAITING,
    });
};

const deleteCampaign = async (campaignId) => {
  await intentDao.deleteIntents({ campaignId });
  await campaignDao.deleteCampaign(campaignId);
};

const joinCampaign = async (userId, campaignId, participants) => {
  const role = await roleDao.findRole({ name: SYSTEM_ROLE.USER });
  if (!role) throw new CustomError(code.BAD_REQUEST, 'Role is not exists');
  const hasJoined = participants.some(
    (item) => String(item.user) === String(userId),
  );
  if (hasJoined) throw new CustomError(code.BAD_REQUEST, 'User joined');

  const newParticipants = [...participants, { user: userId, role: role._id }];
  const joinResult = await campaignDao.updateCampaign(campaignId, {
    participants: newParticipants,
  });

  return joinResult;
};

const leaveCampaign = async (userId, campaignId, participants) => {
  const hasJoined = participants.some(
    (item) => String(item.user) === String(userId),
  );
  if (!hasJoined)
    throw new CustomError(code.BAD_REQUEST, 'User has not joined');

  const newParticipants = participants.filter(
    (item) => String(item.user) !== String(userId),
  );
  const result = await campaignDao.updateCampaign(campaignId, {
    participants: newParticipants,
  });
  return result;
};

const updateStatusCampaign = async (campaign, incomingStatus) => {
  const currentStatus = campaign.status;
  const isInvalidRunning =
    incomingStatus === CAMPAIGN_STATUS.RUNNING &&
    ![CAMPAIGN_STATUS.WAITING, CAMPAIGN_STATUS.PAUSE].includes(currentStatus);
  const isInvalidPause =
    incomingStatus === CAMPAIGN_STATUS.PAUSE &&
    currentStatus !== CAMPAIGN_STATUS.RUNNING;
  const isInvalidEnd =
    incomingStatus === CAMPAIGN_STATUS.END &&
    ![CAMPAIGN_STATUS.RUNNING, CAMPAIGN_STATUS.PAUSE].includes(currentStatus);
  if (isInvalidRunning || isInvalidPause || isInvalidEnd)
    throw new CustomError(code.BAD_REQUEST, 'Can not update status');

  let updateFields = { status: incomingStatus };
  if (
    incomingStatus === CAMPAIGN_STATUS.RUNNING &&
    currentStatus === CAMPAIGN_STATUS.WAITING
  ) {
    updateFields = { ...updateFields, startTime: new Date() };
  }

  if (incomingStatus === CAMPAIGN_STATUS.END) {
    updateFields = { ...updateFields, endTime: new Date() };
  }

  await campaignDao.updateCampaign(campaign._id, updateFields);
  // TODO: send email
};

const getIntents = async ({ search, fields, offset, limit, sort, query }) => {
  const { intents, count } = await intentDao.findIntents({
    search,
    fields,
    offset,
    limit,
    sort,
    query,
  });
  return { intents, count };
};

const syncIntents = async (campaignId, botId) => {
  if (!botId) return;
  const currentIntents = await intentDao.findIntents({ campaignId });
  const SMDIntents = await botService.getIntents(botId);

  const removingIntentIds = currentIntents
    .filter(
      (intent) =>
        !SMDIntents.find((smdIntent) => smdIntent.id === intent.intentId),
    )
    .map((intent) => intent._id);
  await intentDao.removeIntents(removingIntentIds);

  const newIntents = SMDIntents.reduce((accIntent, curIntent) => {
    const intentExist = currentIntents.find(
      (intent) => intent.intentId === curIntent.id,
    );
    if (intentExist) return accIntent;
    return [
      ...accIntent,
      {
        ...curIntent,
        status: INTENT_STATUS.ACTIVE,
        intentId: curIntent.id,
        campaignId,
      },
    ];
  }, []);
  await intentDao.createIntents(newIntents);
};

const getParticipants = async (campaignId) => {
  const participants = await campaignDao.findParticipants({
    _id: campaignId,
  });
  return participants.map((participant) => ({
    userId: participant.user._id,
    email: participant.user.email,
    role: participant.role,
    avatar: participant.avatar,
  }));
};

const addParticipant = async ({
  campaignId,
  participants,
  participantId,
  role,
}) => {
  const userExist = await userDao.findUser({ _id: ObjectId(participantId) });
  if (!userExist) throw new CustomError(code.BAD_REQUEST, 'User is not exists');
  const isAdded = participants.some(
    (item) => String(item.userId) === participantId,
  );
  if (isAdded) throw new CustomError(code.BAD_REQUEST, 'User added');

  await campaignDao.updateCampaign(campaignId, {
    participants: [...participants, { userId: participantId, role }],
  });
};

const deleteParticipant = async (campaignId, participants, participantId) => {
  const userExist = await userDao.findUser({ _id: ObjectId(participantId) });
  if (!userExist) throw new CustomError(code.BAD_REQUEST, 'User is not exists');

  const remainingParticipants = participants.filter(
    (item) => String(item.userId) !== participantId,
  );
  await campaignDao.updateCampaign(campaignId, {
    participants: remainingParticipants,
  });
};

const editRoleParticipant = async ({
  campaignId,
  participants,
  participantId,
  role,
}) => {
  const userExist = await userDao.findUser({ _id: ObjectId(participantId) });
  if (!userExist) throw new CustomError(code.BAD_REQUEST, 'User is not exists');

  const index = participants.findIndex(
    (item) => String(item.userId) === participantId,
  );
  if (index === -1)
    throw new CustomError(code.BAD_REQUEST, 'User has not joined');

  const remainingParticipants = participants;
  remainingParticipants[index] = { userId: participantId, role };
  await campaignDao.updateCampaign(campaignId, {
    participants: remainingParticipants,
  });
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
  updateStatusCampaign,
  getIntents,
  syncIntents,
  getParticipants,
  addParticipant,
  deleteParticipant,
  editRoleParticipant,
};
