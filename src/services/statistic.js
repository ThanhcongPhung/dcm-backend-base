const { SYSTEM_ROLE } = require('../constants');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const statisticDao = require('../daos/statistic');

const getOverview = async ({ user, dates }) => {
  const userRole = (user.role && user.role.name) || '';
  const isManager = [SYSTEM_ROLE.ADMIN, SYSTEM_ROLE.SERVICE_MANAGER].includes(
    userRole,
  );
  if (!isManager) throw new CustomError(code.BAD_REQUEST, 'you have no access');
  const overviewResult = await statisticDao.getOverview({ dates });
  return overviewResult;
};

module.exports = { getOverview };
