const { Joi, validate } = require('express-validation');

const createService = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    campaignTypes: Joi.array().items(Joi.string()).required(),
    url: Joi.string().trim().required(),
    inputs: Joi.array().items(Joi.string()).required(),
    actions: Joi.array().items(Joi.string()).required(),
    owner: Joi.array().items(
      Joi.object({
        user: Joi.string(),
        role: Joi.string(),
      }),
    ),
  }),
};

const updateService = {
  body: Joi.object({
    name: Joi.string(),
    campaignTypes: Joi.array().items(Joi.string()).required(),
    url: Joi.string(),
    inputs: Joi.array().items(Joi.string()),
    actions: Joi.array().items(Joi.string()),
    owner: Joi.array().items(
      Joi.object({
        user: Joi.string(),
        role: Joi.string(),
      }),
    ),
  }),
};

module.exports = {
  createServiceValidate: validate(createService, { keyByField: true }),
  updateServiceValidate: validate(updateService, { keyByField: true }),
};
