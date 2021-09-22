const Role = require('../models/role');
const daoUtils = require('./utils');

const findRoles = async ({ search, query, offset, limit, fields, sort }) => {
  let advanceSearch = {};
  let roleName = query && query.roleName;
  if (roleName) {
    roleName = roleName.split(',');
    advanceSearch = { name: { $in: roleName } };
  }
  const { documents: roles, count } = await daoUtils.findAll(
    Role,
    ['displayName'],
    {
      search,
      query: advanceSearch,
      offset,
      limit,
      fields,
      sort,
    },
  );
  return { roles, count };
};

const findRole = async (condition) => {
  const role = await daoUtils.findOne(Role, condition);
  return role;
};

module.exports = {
  findRoles,
  findRole,
};
