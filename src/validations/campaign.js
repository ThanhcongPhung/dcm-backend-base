const { Joi, validate } = require('express-validation');
const {
  PARTICIPATION_STATUS,
  CAMPAIGN_VISIBILITY,
  COLLECT_DATA_SYSTEM,
  EVENT_JOIN_CAMPAIGN,
} = require('../constants');

const createCampaign = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    desc: Joi.string().trim().required(),
    avatar: Joi.string(),
    startTime: Joi.date().min(new Date()).required(),
    endTime: Joi.date().min(new Date()).required(),
    participants: Joi.array().items(
      Joi.object({
        user: Joi.string(),
        status: Joi.string()
          .trim()
          .valid(...Object.values(PARTICIPATION_STATUS)),
      }),
    ),
    campaignVisibility: Joi.string()
      .trim()
      .valid(...Object.values(CAMPAIGN_VISIBILITY))
      .required(),
    collectDataSystem: Joi.string()
      .trim()
      .valid(...Object.values(COLLECT_DATA_SYSTEM))
      .required(),
  }),
};

const addUser = {
  body: Joi.object({
    userId: Joi.string(),
    event: Joi.string()
      .trim()
      .valid(...Object.values(EVENT_JOIN_CAMPAIGN))
      .required(),
  }),
};

module.exports = {
  createCampaignValidate: validate(createCampaign, { keyByField: true }),
  userJoinValidate: validate(addUser, { keyByField: true }),
};
