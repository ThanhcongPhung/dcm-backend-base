const User = require('../models/user');
const daoUtils = require('./utils');

const createUser = async (newUser) => {
  const user = await User.create(newUser);
  return user;
};

const findUser = async (condition) => {
  const [user] = await User.aggregate([
    { $match: condition },
    {
      $lookup: {
        from: 'roles',
        as: 'role',
        localField: 'roleId',
        foreignField: '_id',
      },
    },
    { $unwind: '$role' },
  ]);
  return user;
};

const updateUser = async (id, updateFields) => {
  const user = await User.findByIdAndUpdate(id, updateFields, {
    new: false,
  }).lean();
  return user;
};

const findUsers = async ({ search, query, offset, limit, fields, sort }) => {
  let searchAdvance = {};
  if (query && query.roleIds) {
    searchAdvance = { roleId: { $in: query.roleIds } };
  }
  const { documents: users, count } = await daoUtils.findAll(User, ['email'], {
    search,
    query: searchAdvance,
    offset,
    limit,
    fields,
    sort,
  });
  return { users, count };
};

module.exports = {
  createUser,
  findUser,
  updateUser,
  findUsers,
};
