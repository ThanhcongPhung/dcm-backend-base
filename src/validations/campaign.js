const { Joi, validate } = require('express-validation');
const { CAMPAIGN_VISIBILITY, EVENT_JOIN_CAMPAIGN } = require('../constants');

const createCampaign = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    campaignVisibility: Joi.string()
      .valid(...Object.values(CAMPAIGN_VISIBILITY))
      .required(),
    action: Joi.string().required(),
    serviceId: Joi.string().required(),
    appId: Joi.string().allow(''),
    botId: Joi.string().allow(''),
  }),
};

const updateCampaign = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    campaignVisibility: Joi.string()
      .valid(...Object.values(CAMPAIGN_VISIBILITY))
      .required(),
    appId: Joi.string().allow(''),
    botId: Joi.string().allow(''),
  }),
};

const updateServiceCampaign = {
  body: Joi.object().keys({
    intents: Joi.array(),
    usecases: Joi.array(),
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
  updateCampaignValidate: validate(updateCampaign, { keyByField: true }),
  updateServiceValidate: validate(updateServiceCampaign, { keyByField: true }),
  userJoinValidate: validate(addUser, { keyByField: true }),
};
