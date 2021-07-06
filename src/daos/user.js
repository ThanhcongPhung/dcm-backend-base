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

module.exports = {
  createUser,
  findUser,
};
