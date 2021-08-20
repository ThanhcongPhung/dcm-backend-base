const Intent = require('../models/intent');
const { INTENT_STATUS } = require('../constants');

const findIntents = async (condition) => {
  const intents = await Intent.find(condition).lean();
  return intents;
};

const createIntents = async (intentArr) => {
  const intents = await Intent.create(intentArr);
  return intents;
};

const deleteIntents = async (conditions) => {
  await Intent.deleteMany(conditions);
};

const updateIntent = async (id, updateFields) => {
  const intent = await Intent.findByIdAndUpdate(id, updateFields, {
    new: true,
  });
  return intent;
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
  updateIntent,
  removeIntents,
};
