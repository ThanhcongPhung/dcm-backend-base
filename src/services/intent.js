const intentDao = require('../daos/intent');
const botService = require('./bot');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');
const campaignDao = require('../daos/campaign');

const createIntents = async (botId, campaignId) => {
  const { result } = await botService.getIntents(botId);
  const intents = result.intents.map((item) => {
    return { ...item, campaignId, intentId: item.id };
  });
  if (intents) await intentDao.createIntents(intents);
};

const syncIntents = async (campaignId) => {
  const campaignExist = await campaignDao.findCampaign(campaignId);
  if (!campaignExist)
    throw new CustomError(code.BAD_REQUEST, 'Campaign is not exists');
  const { botId } = campaignExist;
  if (botId) {
    const oldIntents = await intentDao.findIntents({ campaignId });
    const { result } = await botService.getIntents(botId);
    const newIntents = result.intents.map((item) => {
      return { ...item, campaignId, intentId: item.id };
    });
    oldIntents.map(async (intent) => {
      const intentExist = newIntents.find(
        (item) => item.intentId === intent.intentId,
      );

      if (!intentExist) {
        await intentDao.updateIntent(intent.id, { status: 'delete' });
      }
      return oldIntents;
    });
    let newIntentsUpdate = [];
    newIntents.map((intent) => {
      const intentExist = oldIntents.find(
        (item) => item.intentId === intent.intentId,
      );
      if (!intentExist) newIntentsUpdate = [...newIntentsUpdate, intent];
      return newIntentsUpdate;
    });
    await intentDao.createIntents(newIntentsUpdate);
  }
};

module.exports = {
  createIntents,
  syncIntents,
};
