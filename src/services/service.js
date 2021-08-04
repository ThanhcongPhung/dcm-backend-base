const serviceDao = require('../daos/service');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');

const getServices = async ({ search, fields, offset, limit, sort }) => {
  const query = {};

  if (search) query.search = search;
  if (fields) query.fields = fields.split(',');
  if (offset) query.offset = parseInt(offset, 10);
  if (limit) query.limit = parseInt(limit, 10);
  if (sort) query.sort = sort.split(',');

  const { services, count } = await serviceDao.findServices(query);
  return { services, count };
};

const getService = async (serviceId) => {
  const service = await serviceDao.findService(serviceId);
  if (!service)
    throw new CustomError(code.BAD_REQUEST, 'Service is not exists');

  return service;
};

const createService = async (createFields) => {
  const { name } = createFields;
  const service = await serviceDao.findService({ name });
  if (service) throw new CustomError(code.BAD_REQUEST, 'Service is exists');
  const newService = await serviceDao.createService(createFields);
  return newService;
};

const updateService = async (serviceId, updateFields) => {
  const serviceExist = await serviceDao.findService(serviceId);

  if (!serviceExist)
    throw new CustomError(code.BAD_REQUEST, 'Service is not exists');
  const service = await serviceDao.updateService(serviceId, updateFields);
  return service;
};

const deleteService = async (serviceId) => {
  const serviceExist = await serviceDao.findService(serviceId);
  if (!serviceExist)
    throw new CustomError(code.BAD_REQUEST, 'Service is not exists');

  await serviceDao.deleteService(serviceId);
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
};
