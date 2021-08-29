const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const userDao = require('../daos/user');
const roleDao = require('../daos/role');

const getUsers = async ({ search, fields, offset, limit, sort, query }) => {
  let searchAdvance = {};
  if (query.roleName) {
    const roleExist = await roleDao.findRole({ name: query.roleName });
    if (!roleExist) return { users: [], count: 0 };
    searchAdvance = { role: roleExist._id };
  }
  const { users, count } = await userDao.findUsers({
    search,
    fields,
    offset,
    limit,
    sort,
    query: searchAdvance,
  });
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
