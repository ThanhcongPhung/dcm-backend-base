const serviceService = require('../services/service');

const getServices = async (req, res) => {
  const { search, fields, offset, limit, sort } = req.query;

  const query = {};

  if (search) query.search = search;
  if (fields) query.fields = fields.split(',');
  if (offset) query.offset = parseInt(offset, 10);
  if (limit) query.limit = parseInt(limit, 10);
  if (sort) query.sort = sort.split(',');
  const { services, count } = await serviceService.getServices(query);

  return res.send({
    status: 1,
    result: {
      services,
      metadata: {
        total: count,
      },
    },
  });
};

const getService = async (req, res) => {
  const { serviceId } = req.params;
  const service = await serviceService.getService(serviceId);
  return res.send({ status: 1, result: service });
};

const createService = async (req, res) => {
  const createFields = req.body;
  const service = await serviceService.createService(createFields);
  return res.send({ status: 1, result: service });
};

const updateService = async (req, res) => {
  const { serviceId } = req.params;
  const updateFields = req.body;
  const service = await serviceService.updateService(serviceId, updateFields);
  return res.send({ status: 1, result: service });
};

const deleteService = async (req, res) => {
  const { serviceId } = req.params;
  await serviceService.deleteService(serviceId);
  return res.send({ status: 1 });
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
};
