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

const getServiceManagers = async (condition) => {
  const [service] = await Service.aggregate([
    { $match: condition },
    { $unwind: '$managers' },
    {
      $lookup: {
        from: 'users',
        localField: 'managers',
        foreignField: '_id',
        as: 'managers',
      },
    },
    { $unwind: '$managers' },
    { $group: { _id: '$_id', managers: { $push: '$managers' } } },
  ]);
  return service.managers;
};

module.exports = {
  findServices,
  findService,
  createService,
  updateService,
  deleteService,
  getServiceManagers,
};
