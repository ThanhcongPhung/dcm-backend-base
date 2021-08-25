const Intent = require('../models/intent');
const daoUtils = require('./utils');
const { INTENT_STATUS } = require('../constants');

const findIntents = async ({ search, query, offset, limit, fields, sort }) => {
  const { documents: intents, count } = await daoUtils.findAll(
    Intent,
    ['displayName'],
    {
      search,
      query,
      offset,
      limit,
      fields: fields || ['displayName', 'name', 'intentId'],
      sort,
    },
  );
  return { intents, count };
};

const createIntents = async (intentArr) => {
  const intents = await Intent.create(intentArr);
  return intents;
};

const deleteIntents = async (conditions) => {
  await Intent.deleteMany(conditions);
};

const removeIntents = async (removingIntentIds) => {
  const intents = await Intent.updateMany(
    { _id: { $in: removingIntentIds } },
    { status: INTENT_STATUS.DELETE },
    {
      new: true,
    },
  );
  return intents;
};
module.exports = {
  createIntents,
  deleteIntents,
  findIntents,
  removeIntents,
};
