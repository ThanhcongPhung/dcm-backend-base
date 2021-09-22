const { ObjectId } = require('mongoose').Types;
const serviceDao = require('../daos/service');
const userDao = require('../daos/user');
const roleDao = require('../daos/role');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const campaignDao = require('../daos/campaign');
const { SYSTEM_ROLE } = require('../constants');

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

const getServiceManagers = async (serviceId) => {
  const managers = await serviceDao.getServiceManagers({ _id: serviceId });
  return managers.map((manager) => ({
    managerId: manager._id,
    email: manager.email,
    avatar: manager.avatar,
    name: manager.name,
    createdAt: manager.createdAt,
  }));
};

const addManager = async (serviceId, managers, managerId) => {
  const manager = await userDao.findUser({ _id: ObjectId(managerId) });
  if (!manager) throw new CustomError(code.BAD_REQUEST, 'User is not exists');
  if (managers) {
    const isAdded = managers.some((id) => String(id) === managerId);
    if (isAdded) throw new CustomError(code.BAD_REQUEST, 'User added');
  }
  const newManagers = managers
    ? [...managers, ObjectId(managerId)]
    : [ObjectId(managerId)];
  await serviceDao.updateService(serviceId, {
    managers: newManagers,
  });

  const serviceManagerRole = await roleDao.findRole({
    name: SYSTEM_ROLE.SERVICE_MANAGER,
  });
  const userExistRole = (manager.role && manager.role.name) || '';
  if (userExistRole !== SYSTEM_ROLE.SERVICE_MANAGER)
    await userDao.updateUser(manager._id, { roleId: serviceManagerRole._id });
};

const deleteManager = async (serviceId, managers, managerId) => {
  const manager = await userDao.findUser({ _id: ObjectId(managerId) });
  if (!manager) throw new CustomError(code.BAD_REQUEST, 'User is not exists');
  const isAdded = managers.some((item) => String(item) === managerId);
  if (!isAdded) throw new CustomError(code.BAD_REQUEST, 'User has not added');

  const remainingManagers = managers.filter(
    (item) => String(item) !== managerId,
  );
  await serviceDao.updateService(serviceId, { managers: remainingManagers });

  const userRole = await roleDao.findRole({ name: SYSTEM_ROLE.USER });
  const userExistRole = (manager.role && manager.role.name) || '';
  if (userExistRole !== SYSTEM_ROLE.USER)
    await userDao.updateUser(manager._id, { roleId: userRole._id });
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServiceManagers,
  addManager,
  deleteManager,
};
