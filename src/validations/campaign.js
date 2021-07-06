const { Joi, validate } = require('express-validation');
const {
  PARTICIPATION_STATUS,
  CAMPAIGN_VISIBILITY,
  COLLECT_DATA_SYSTEM,
} = require('../constants');

const campaign = {
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

module.exports = {
  campaignValidate: validate(campaign, { keyByField: true }),
};
