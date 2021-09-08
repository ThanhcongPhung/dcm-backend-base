const callApi = require('../utils/callApi');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');

const {
  APP_API_URL,
  APP_SECRET_TOKEN,
  BOT_SECRET_KEY,
  BOT_API_URL,
} = require('../configs');

const getApp = async (appId) => {
  const options = {
    method: 'GET',
    url: `${APP_API_URL}/api/v1/apps/${appId}`,
    headers: {
      Authorization: `Bearer ${APP_SECRET_TOKEN}`,
    },
  };
  const { result } = await callApi(options);
  return result;
};

const getIntents = async (botId) => {
  try {
    const options = {
      method: 'GET',
      url: `${BOT_API_URL}/api/v2/intents`,
      headers: {
        'bot-id': botId,
        Authorization: `Bearer ${BOT_SECRET_KEY}`,
        env: 'live',
      },
      params: {
        fields: 'displayName,name',
      },
    };
    const response = await callApi(options);
    return response.result.intents;
  } catch (error) {
    throw new CustomError(
      code.BAD_REQUEST,
      'get intents for bot integrate failed',
    );
  }
};

module.exports = {
  getApp,
  getIntents,
};
