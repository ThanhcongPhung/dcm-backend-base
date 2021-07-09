const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const userDao = require('../daos/user');

const updateUser = async (userId, updateFields) => {
  const userExist = await userDao.findUser({ _id: userId });
  if (!userExist) throw new CustomError(code.BAD_REQUEST, 'User is not exists');

  const user = await userDao.updateUser(userId, updateFields);
  return user;
};

const getUser = async (userId) => {
  const user = await userDao.findUser({ _id: userId });
  if (!user) throw new CustomError(code.BAD_REQUEST, 'User is not exists');
  return user;
};

module.exports = {
  updateUser,
  getUser,
};
