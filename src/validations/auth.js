const { Joi, validate } = require('express-validation');
const { SSO_EVENT } = require('../constants');

const ssoUser = {
  body: Joi.object({
    event: Joi.string()
      .valid(...Object.values(SSO_EVENT))
      .required(),
    data: Joi.object().required(),
  }),
};

module.exports = {
  ssoUserValidate: validate(ssoUser, { keyByField: true }),
};
