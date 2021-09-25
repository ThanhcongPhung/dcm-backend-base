const asyncMiddleware = require('./async');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const serviceDao = require('../daos/service');

const getService = async (req, res, next) => {
  const serviceId = req.headers['service-id'] || req.params.serviceId;
  const service = await serviceDao.findService(serviceId);
  if (!service)
    throw new CustomError(codes.BAD_REQUEST, 'Service is not exists');
  req.service = service;
  return next();
};

module.exports = asyncMiddleware(getService);
