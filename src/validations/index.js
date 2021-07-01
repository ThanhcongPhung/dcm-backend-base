const { Joi, validate } = require('express-validation');

const helloWorld = {
  query: Joi.object({
    name: Joi.string().trim().required(),
  }),
};

module.exports = {
  helloWorldValidate: validate(helloWorld, { keyByField: true }),
};
