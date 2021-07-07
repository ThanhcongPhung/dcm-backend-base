const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const userDao = require('../daos/user');

const getUsers = async ({ search, fields, offset, limit, sort }) => {
  const query = {};

  if (search) query.search = search;
  if (fields) query.fields = fields.split(',');
  if (offset) query.offset = parseInt(offset, 10);
  if (limit) query.limit = parseInt(limit, 10);
  if (sort) query.sort = sort.split(',');

  const { users, count } = await userDao.findUsers(query);
  return { users, count };
};

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
  getUsers,
  updateUser,
  getUser,
};
