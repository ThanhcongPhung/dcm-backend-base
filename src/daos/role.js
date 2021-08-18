const Role = require('../models/role');
const daoUtils = require('./utils');

const findRoles = async ({ search, query, offset, limit, fields, sort }) => {
  const { documents: roles, count } = await daoUtils.findAll(
    Role,
    ['displayName'],
    {
      search,
      query,
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
