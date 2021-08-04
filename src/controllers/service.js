const serviceService = require('../services/service');

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

module.exports = {
  createService,
  updateService,
};
