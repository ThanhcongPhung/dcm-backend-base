const User = require('../models/user');
const daoUtils = require('./utils');

const createUser = async (newUser) => {
  const user = await User.create(newUser);
  return user;
};

const findUser = async (condition) => {
  const user = await daoUtils.findOne(User, condition);
  return user;
};

const updateUser = async (id, updateFields) => {
  const user = await User.findByIdAndUpdate(id, updateFields, {
    new: false,
  }).lean();
  return user;
};

module.exports = {
  createUser,
  findUser,
  updateUser,
};
