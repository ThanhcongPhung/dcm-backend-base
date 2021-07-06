const userService = require('../services/user');

const updateUser = async (req, res) => {
  const updateFields = req.body;
  const { ssoUserId } = req.params;
  const user = await userService.updateUser(ssoUserId, updateFields);
  return res.send({ status: 1, result: user });
};

module.exports = {
  updateUser,
};
