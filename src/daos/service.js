const Service = require('../models/service');
const daoUtils = require('./utils');

const findService = async (condition) => {
  const service = await daoUtils.findOne(Service, condition);
  return service;
};

const createService = async (createFields) => {
  const service = await Service.create(createFields);
  return service;
};

const updateService = async (id, updateFields) => {
  const service = await Service.findByIdAndUpdate(id, updateFields, {
    new: true,
  });
  return service;
};

module.exports = {
  findService,
  createService,
  updateService,
};
