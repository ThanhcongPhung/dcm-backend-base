const { Joi, validate } = require('express-validation');
const {
  CAMPAIGN_VISIBILITY,
  CAMPAIGN_STATUS,
  CAMPAIGN_TYPE,
  CAMPAIGN_ROLE,
} = require('../constants');

const createCampaign = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().allow(''),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    campaignVisibility: Joi.string()
      .valid(...Object.values(CAMPAIGN_VISIBILITY))
      .required(),
    campaignType: Joi.string()
      .valid(...Object.values(CAMPAIGN_TYPE))
      .required(),
    actions: Joi.array().items(Joi.string()).required(),
    serviceId: Joi.string().required(),
    appId: Joi.string().allow(''),
    botId: Joi.string().allow(''),
    apiKey: Joi.string().allow(''),
  }),
};

const updateCampaign = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().allow(''),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    campaignVisibility: Joi.string()
      .valid(...Object.values(CAMPAIGN_VISIBILITY))
      .required(),
    appId: Joi.string().allow(''),
    botId: Joi.string().allow(''),
    apiKey: Joi.string().allow(''),
  }),
};

const updateServiceCampaign = {
  body: Joi.object().keys({
    intents: Joi.array(),
    usecases: Joi.array(),
    intentIds: Joi.array(),
    tags: Joi.array(),
    target: Joi.number(),
  }),
};

const updateStatusCampaign = {
  body: Joi.object({
    status: Joi.string()
      .valid(...Object.values(CAMPAIGN_STATUS))
      .required(),
  }),
};

const participant = {
  body: Joi.object({
    participantId: Joi.string(),
    role: Joi.string()
      .valid(...Object.values(CAMPAIGN_ROLE))
      .required(),
  }),
};

module.exports = {
  createCampaignValidate: validate(createCampaign, { keyByField: true }),
  updateCampaignValidate: validate(updateCampaign, { keyByField: true }),
  updateServiceValidate: validate(updateServiceCampaign, { keyByField: true }),
  updateStatusValidate: validate(updateStatusCampaign, { keyByField: true }),
  participantValidate: validate(participant, { keyByField: true }),
};
