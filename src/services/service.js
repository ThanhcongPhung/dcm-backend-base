const serviceDao = require('../daos/service');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');

const createService = async (createFields) => {
  const { name } = createFields;
  const service = await serviceDao.findService({ name });
  if (service) throw new CustomError(code.BAD_REQUEST, 'Service is exists');
  const newService = await serviceDao.createService(createFields);
  return newService;
};

module.exports = {
  createService,
};
