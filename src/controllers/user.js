const userService = require('../services/user');

const getUsers = async (req, res) => {
  const { search, fields, offset, limit, sort } = req.query;

  const { users, count } = await userService.getUsers({
    search,
    fields,
    offset,
    limit,
    sort,
  });
  return res.send({
    status: 1,
    result: {
      users,
      metadata: {
        total: count,
      },
    },
  });
};

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

module.exports = {
  getUsers,
  updateUser,
  getUser,
};
