const Service = require('../models/service');
const daoUtils = require('./utils');

const findService = async (condition) => {
  const campaign = await daoUtils.findOne(Service, condition);
  return campaign;
};

const createService = async (createFields) => {
  const service = await Service.create(createFields);
  return service;
};

module.exports = {
  findService,
  createService,
};
