const { Joi, validate } = require('express-validation');

const createService = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    desc: Joi.string().trim().required(),
    url: Joi.string().trim().required(),
    inputs: Joi.array().items(Joi.string()).required(),
    actions: Joi.array().items(Joi.string()).required(),
    serviceOwner: Joi.array().items(
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
    desc: Joi.string(),
    url: Joi.string(),
    inputs: Joi.array().items(Joi.string()),
    actions: Joi.array().items(Joi.string()),
    serviceOwner: Joi.array().items(
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
