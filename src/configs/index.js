const {
  PORT,
  MONGO_URI,
  REDIS_URI,
  JWT_SECRET_KEY,
  JWT_EXPIRES_TIME,
  CLIENT_SECRET,
  CLIENT_ID,
} = process.env;

const { A_WEEK } = require('../constants');

module.exports = {
  PORT: PORT || 3000,
  MONGO_URI,
  REDIS_URI,
  JWT_SECRET_KEY,
  JWT_EXPIRES_TIME: parseInt(JWT_EXPIRES_TIME, 10) || A_WEEK,
  CLIENT_SECRET,
  CLIENT_ID,
};
