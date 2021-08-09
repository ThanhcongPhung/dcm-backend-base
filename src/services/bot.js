const axios = require('axios');
const camelCaseKeys = require('camelcase-keys');

const {
  API_DOMAIN_APP,
  API_DOMAIN_INTENT,
  TOKEN_APP,
  TOKEN_INTENT,
} = require('../configs');

const axiosInstance = axios.create({
  responseType: 'json',
  timeout: 10 * 1000,
  transformResponse: [
    (data) => camelCaseKeys(JSON.parse(data), { deep: true }),
  ],
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  },
);

const getBotByAppId = async (appId) => {
  const options = {
    method: 'GET',
    url: `${API_DOMAIN_APP}/${appId}`,
    headers: {
      Authorization: TOKEN_APP,
    },
  };
  const response = await axiosInstance(options);
  return response;
};

const getIntents = async (botId) => {
  const options = {
    method: 'GET',
    url: API_DOMAIN_INTENT,
    headers: {
      'bot-id': botId,
      Authorization: TOKEN_INTENT,
    },
    params: {
      fields: 'displayName,name',
    },
  };
  const response = await axiosInstance(options);
  return response;
};

module.exports = {
  getBotByAppId,
  getIntents,
};
