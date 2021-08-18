const Intent = require('../models/intent');

const createIntents = async (intentArr) => {
  const intents = await Intent.create(intentArr);
  return intents;
};

const deleteIntents = async (conditions) => {
  await Intent.deleteMany(conditions);
};

module.exports = {
  createIntents,
  deleteIntents,
};
