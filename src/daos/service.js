const Service = require('../models/service');
const daoUtils = require('./utils');

const findServices = async ({ search, query, offset, limit, fields, sort }) => {
  const { documents: services, count } = await daoUtils.findAll(
    Service,
    ['name'],
    {
      search,
      query,
      offset,
      limit,
      fields,
      sort,
    },
  );
  return { services, count };
};

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

const deleteService = async (serviceId) => {
  await Service.findByIdAndDelete(serviceId);
};

module.exports = {
  findServices,
  findService,
  createService,
  updateService,
  deleteService,
};
