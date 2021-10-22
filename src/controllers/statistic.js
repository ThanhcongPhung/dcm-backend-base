const statisticService = require('../services/statistic');

const getOverview = async (req, res) => {
  const { user } = req;
  const { dates } = req.body;
  const overviewResult = await statisticService.getOverview({ user, dates });
  return res.send({ status: 1, result: overviewResult });
};

module.exports = { getOverview };
