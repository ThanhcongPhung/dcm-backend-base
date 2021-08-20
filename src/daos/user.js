const User = require('../models/user');
const daoUtils = require('./utils');

const createUser = async (newUser) => {
  const user = await User.create(newUser);
  return user;
};

const findUser = async (condition) => {
  const user = await User.findOne(condition)
    .lean()
    .populate({ path: 'role', select: 'name' })
    .exec();
  return user;
};

const updateUser = async (id, updateFields) => {
  const user = await User.findByIdAndUpdate(id, updateFields, {
    new: false,
  }).lean();
  return user;
};
const findUsers = async ({ search, query, offset, limit, fields, sort }) => {
  const { documents: users, count } = await daoUtils.findAll(User, ['email'], {
    search,
    query,
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
