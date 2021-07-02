const { PORT, MONGO_URI } = process.env;

module.exports = {
  PORT: PORT || 3000,
  MONGO_URI,
};
