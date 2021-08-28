const userService = require('../services/user');

const getUsers = async (req, res) => {
  const { search, fields, offset, limit, sort, roleName } = req.query;
  const query = {};
  query.query = { roleName };
  if (search) query.search = search;
  if (fields) query.fields = fields.split(',');
  if (offset) query.offset = parseInt(offset, 10);
  if (limit) query.limit = parseInt(limit, 10);
  if (sort) query.sort = sort.split(',');

  const { users, count } = await userService.getUsers(query);
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
