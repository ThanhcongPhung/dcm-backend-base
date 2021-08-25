const roleDao = require('../daos/role');

const getRoles = async (req, res) => {
  const { search, fields, offset, limit, sort } = req.query;

  const query = {};
  if (search) query.search = search;
  if (fields) query.fields = fields.split(',');
  if (offset) query.offset = parseInt(offset, 10);
  if (limit) query.limit = parseInt(limit, 10);
  if (sort) query.sort = sort.split(',');
  const { roles, count } = await roleDao.findRoles({
    search,
    fields,
    offset,
    limit,
    sort,
    query,
  });
  return res.send({
    status: 1,
    result: {
      roles,
      metadata: {
        total: count,
      },
    },
  });
};

module.exports = {
  getRoles,
};
