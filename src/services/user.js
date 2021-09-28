const { ObjectId } = require('mongoose').Types;
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const serviceDao = require('../daos/service');
const userDao = require('../daos/user');
const roleDao = require('../daos/role');
const { SYSTEM_ROLE } = require('../constants');

const getUsers = async ({ search, fields, offset, limit, sort, query }) => {
  let searchAdvance = {};
  const roleName = query && query.roleName;
  if (roleName) {
    const { roles } = await roleDao.findRoles({ query: { roleName } });
    if (!roles.length) return { users: [], count: 0 };
    const roleIds = roles.map((item) => item._id);
    searchAdvance = { roleIds };
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
  const { roleId } = updateFields;
  const userExist = await userDao.findUser({ _id: ObjectId(userId) });
  if (!userExist) throw new CustomError(code.BAD_REQUEST, 'User is not exists');

  const validServiceManagerRole =
    userExist.role &&
    userExist.role.name &&
    userExist.role.name === SYSTEM_ROLE.SERVICE_MANAGER;
  if (validServiceManagerRole) {
    const { services } = await serviceDao.findServices({
      query: { managerIds: [userExist._id] },
    });
    if (services.length)
      throw new CustomError(code.SERVICE_USED, 'User is managing a service');
  }

  if (roleId) {
    const roleExist = await roleDao.findRole(roleId);
    if (!roleExist)
      throw new CustomError(code.BAD_REQUEST, 'Role is not exists');
  }

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
