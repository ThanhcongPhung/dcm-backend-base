const userService = require('../services/user');

const updateUser = async (req, res) => {
  const updateFields = req.body;
  const { userId } = req.params;
  const user = await userService.updateUser(userId, updateFields);
  return res.send({ status: 1, result: user });
};
const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await userService.getUser(userId);
  return res.send({ status: 1, result: user });
};

module.exports = { updateUser, getUser };
