const callApi = require('../utils/callApi');

const {
  APP_API_URL,
  APP_SECRET_TOKEN,
  BOT_SECRET_KEY,
  BOT_API_URL,
} = require('../configs');

const getApp = async (appId) => {
  const options = {
    method: 'GET',
    url: `${APP_API_URL}/apps/${appId}`,
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
      url: `${BOT_API_URL}/intents`,
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
    return error.response;
  }
};

module.exports = {
  getApp,
  getIntents,
};
