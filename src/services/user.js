const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const userDao = require('../daos/user');

const updateUser = async (ssoUserId, updateFields) => {
  const userExist = await userDao.findUser({ ssoUserId });
  if (!userExist) throw new CustomError(code.BAD_REQUEST, 'User is not exists');

  const campaign = await userDao.updateUser(ssoUserId, updateFields);
  return campaign;
};

module.exports = {
  updateUser,
};
