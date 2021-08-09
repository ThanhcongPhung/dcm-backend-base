const intentService = require('../services/intent');

const syncIntents = async (req, res) => {
  const { campaignId } = req.body;
  await intentService.syncIntents(campaignId);
  return res.send({ status: 1 });
};

module.exports = {
  syncIntents,
};
