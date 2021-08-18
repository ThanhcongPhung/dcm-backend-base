const botService = require('../services/bot');

const getApp = async (req, res) => {
  const { appId } = req.params;
  const app = await botService.getApp(appId);
  return res.send({ status: 1, result: app });
};

const getIntents = async (req, res) => {
  const { botId } = req.query;
  const intents = await botService.getIntents(botId);
  return res.send({ status: 1, result: intents });
};

module.exports = {
  getApp,
  getIntents,
};
