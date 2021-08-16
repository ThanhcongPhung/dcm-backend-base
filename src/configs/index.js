const { A_WEEK } = require('../constants');

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_EXPIRES_TIME: parseInt(process.env.JWT_EXPIRES_TIME, 10) || A_WEEK,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CLIENT_ID: process.env.CLIENT_ID,
  APP_API_URL: process.env.APP_API_URL,
  BOT_API_URL: process.env.BOT_API_URL,
  APP_SECRET_TOKEN: process.env.APP_SECRET_TOKEN,
  BOT_SECRET_KEY: process.env.BOT_SECRET_KEY,
};
