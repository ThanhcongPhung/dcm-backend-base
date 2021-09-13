const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const serviceDao = require('../daos/service');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const campaignDao = require('../daos/campaign');

const getServices = async ({ search, fields, offset, limit, sort, query }) => {
  const { services, count } = await serviceDao.findServices({
    search,
    fields,
    offset,
    limit,
    sort,
    query,
  });
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
  const campaignExist = await campaignDao.findCampaign({
    serviceId: ObjectId(serviceId),
  });
  if (campaignExist)
    throw new CustomError(
      code.SERVICE_USED,
      'The service is being used in a campaign',
    );

  await serviceDao.deleteService(serviceId);
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
};
